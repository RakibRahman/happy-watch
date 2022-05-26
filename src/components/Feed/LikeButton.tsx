import {Box, Text} from '@chakra-ui/react';
import {
  arrayRemove,
  arrayUnion,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FcLike, FcLikePlaceholder} from 'react-icons/fc';
import {useAuth} from '../../context/AuthContext';
import {fbFireStore} from '../../lib/firebase';
import {PostProps} from '../../utils/types';

type Props = {
  post: PostProps;
};
const LikeButton: React.FC<Props> = ({post}) => {
  const {user} = useAuth()!;
  if (!user) return null;
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [toggleLike, setToggleLike] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState(false);
  const userPost = fbFireStore
    .collection('users')
    .doc(post.user.uid)
    .collection('posts')
    .doc(post.postId);
  let likedPostRef = doc(
    fbFireStore,
    'users',
    `${user.uid}`,
    'LikedPosts',
    post.postId,
  );

  const addLike = async () => {
    setToggleLike(true);

    const like = userPost
      .set(
        {
          likedBy: arrayUnion(user.uid),
        },
        {merge: true},
      )
      .then(() => {
        setIsLiked(true);
        console.log('post liked');
      })
      .catch(err => {
        console.log(err);
      });

    const likedPost = setDoc(
      doc(fbFireStore, 'users', `${user.uid}`, 'LikedPosts', post.postId),
      post,
    );

    const responses = await Promise.allSettled([like, likedPost]);

    console.log(responses);
  };

  const removeLike = async () => {
    setToggleLike(false);

    const remove = userPost
      .set(
        {
          likedBy: arrayRemove(user.uid),
        },
        {merge: true},
      )
      .then(() => {
        console.log('post like removed');
        setIsLiked(false);
      })
      .catch(err => {
        console.log(err);
      });
    const deletePost = deleteDoc(likedPostRef);

    const [rm, del] = await Promise.all([remove, deletePost]);
  };

  const updateLikeCount = async () => {
    const postRef = collectionGroup(fbFireStore, 'posts');
    const qPosts = query(postRef, where('postId', '==', post.postId));

    const docSnap = await getDocs(qPosts);

    let postData = docSnap.docs.map(doc => ({...doc.data()}));
    console.log(postData);
    setTotalLikes(postData[0].likedBy.length);
    setIsLiked(post.likedBy.includes(user.uid));
  };

  useEffect(() => {
    updateLikeCount();
    console.log('Toggle:', toggleLike);
  }, [toggleLike]);

  // useEffect(() => {
  //     fbFireStore.collection('users').doc(post.user.uid).collection("posts").onSnapshot((snapshot) => {
  //         console.log(snapshot.docs);
  //     });
  // },[toggleLike])
  return (
    <Box fontSize="2rem">
      <Text>{totalLikes}</Text>

      {isLiked ? (
        <FcLike onClick={removeLike} />
      ) : (
        <FcLikePlaceholder onClick={addLike} />
      )}
    </Box>
  );
};

export default LikeButton;
