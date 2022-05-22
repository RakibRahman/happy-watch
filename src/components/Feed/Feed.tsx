import { Box, Heading, Image, Spinner, Flex, Text, Stack } from '@chakra-ui/react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { fbFireStore } from '../../lib/firebase';
import { User, PostProps } from '../../utils/types';
import FeedPost from './FeedPost';
import { FaMusic } from 'react-icons/fa';
import UserInfo from './UserInfo';
import VideoPlayer from '../VideoPlayer';

const Feed = () => {
  const [posts, setPosts] = useState<PostProps[] | any>([]);
  const [loading, setLoading] = useState(false);
  const getPostData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collectionGroup(fbFireStore, 'posts'),
      );

      let postData = querySnapshot.docs.map(doc => ({ ...doc.data() }));
      setPosts(postData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  return (
    <>
      {loading && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}

      <Box className="glass-bg">
        {posts.length === 0 && <Heading>NO posts</Heading>}
        {posts.map((post: PostProps) => (
          <Flex flexDirection='column' align='center' key={post.postId}  >
            <Flex flexDirection='column' align='center' mt={10} border='1px solid blue'>
              <UserInfo user={post.user} />

              <FeedPost content={post.content} />
              <Flex align="center" gap={3}>
                <FaMusic /> {post.audio_name}
              </Flex>
              <VideoPlayer
                videoLink={post.videoUrl}
                showControl={true}
                isLoop={false}
              />
            </Flex>
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default Feed;
