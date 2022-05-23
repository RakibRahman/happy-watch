import { Box, Heading, Image, Spinner, Flex, Text, Stack, Button } from '@chakra-ui/react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { fbFireStore } from '../../lib/firebase';
import { User, PostProps } from '../../utils/types';
import FeedPost from './FeedPost';
import UserInfo from './UserInfo';
import VideoPlayer from '../VideoPlayer';
import useVideo from '../../hooks/useVideo';

const Feed = () => {
  const {log} = console;
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
      log(err);
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
      {/* <VideoPlayer
              videoRef={videoRef}
                videoLink={'https://firebasestorage.googleapis.com/v0/b/happy-watch.appspot.com/o/videos%2FuygH8guxf4bh4NXh2aGmYLUFB2s1%2F2mWUqyAOY-?alt=media&token=fd0451a0-082e-4c34-aba0-ac408e247698'}
                showControl={true}
                isLoop={false}
                autoPlay={false}
              /> */}

        {posts.length === 0 && <Heading>NO posts</Heading>}
        {posts.map((post: PostProps) => (
          <Flex flexDirection='column' align='center' key={post.postId}  >
            <Flex flexDirection='column' align='center' mt={10} border='1px solid blue'>
              <UserInfo user={post.user} />

              <FeedPost post={post} />
              <Flex align="center" gap={3}>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default Feed;
