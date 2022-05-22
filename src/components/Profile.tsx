import {Flex, Heading, Image, Spinner, Text} from '@chakra-ui/react';
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fbFireStore} from '../lib/firebase';
import {PostProps, User} from '../utils/types';
const Profile = () => {
  let {username} = useParams();

  const [userInfo, setUserInfo] = useState<User | any>({});
  const [posts, setPosts] = useState<PostProps[] | any>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    const userRef = collection(fbFireStore, 'users');
    const qUser = query(userRef, where('userName', '==', `${username}`));
    const postRef = collectionGroup(fbFireStore, 'posts');
    const qPosts = query(postRef, where('user.userName', '==', `${username}`));

    setLoading(true);

    try {
      const querySnapshotUser = await getDocs(qUser);
      const querySnapshotPosts = await getDocs(qPosts);

      const userData = querySnapshotUser.docs.map(doc => ({...doc.data()}));

      setUserInfo(userData[0]);
      if (querySnapshotPosts.docs.length>0) {
        setPosts(querySnapshotPosts.docs.map(doc => ({...doc.data()})));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  return (
    userInfo && (
      <>
        {loading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Flex gap={3}>
            <Image
              src={userInfo.photoURL}
              w="50px"
              height="50px"
              borderRadius="50%"
            />
            <Flex align="center" gap={1}>
              <Heading size="md">{userInfo.userName}</Heading>
              <Text size="sm">{userInfo.displayName}</Text>
            </Flex>
          </Flex>
        )}
      </>
    )
  );
};

export default Profile;
