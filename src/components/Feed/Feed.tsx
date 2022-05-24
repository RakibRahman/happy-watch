import { Box, Heading, Image, Spinner, Flex, Text,Center, Stack, Button } from '@chakra-ui/react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { fbFireStore } from '../../lib/firebase';
import { User, PostProps } from '../../utils/types';
import FeedPost from './FeedPost';
import UserInfo from './UserInfo';
import VideoPlayer from '../VideoPlayer';
import useVideo from '../../hooks/useVideo';
import {Link} from 'react-router-dom';

const Feed = () => {
  const { log } = console;
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
     
       <Box>
        {loading && (
          <Center>
              <Spinner
                thickness="30px"
                speed="0.85s"
                emptyColor="gray.400"
                color="#FE2C55"
                size="xxl"
              />
          </Center>
          )}
         {loading && (<Text textAlign='center' fontSize='2rem'>Posts Loading...</Text>)}
        {!loading && posts.length === 0 && <Heading textAlign={'center'}>No post found</Heading>}
       </Box>
    

      <Flex flexDirection='column' align='center' className="glass-bg">
      
          {posts.map((post: PostProps) => (
            <Flex my={5} key={post.postId} boxShadow='md' p='6' rounded='md' bg='white' w='550px' align="flex-start">
             <Image src={post.user.photoURL} w="50px" height="50px" borderRadius="50%" objectFit='cover' alt='profile pic'  mr={3}/>
              <Flex  flexDirection='column' >
                <UserInfo user={post.user} />
                <FeedPost post={post} />
                <Flex align="center" gap={3}>
                </Flex>
              </Flex>
            </Flex>
  
          ))}
      </Flex>
    </>
  );
};

export default Feed;
