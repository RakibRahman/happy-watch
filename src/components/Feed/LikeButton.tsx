import React, { useState, useEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react';
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { doc, getDoc, getDocs, collection, collectionGroup, where, query, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { fbFireStore } from '../../lib/firebase';
import { PostProps } from '../../utils/types';
import { useAuth } from '../../context/AuthContext';

type Props = {
    post: PostProps
}
const LikeButton: React.FC<Props> = ({ post }) => {
    const { user } = useAuth()!;
    if (!user) return null;
    const [totalLikes, setTotalLikes] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const userPosts = fbFireStore.collection('users')
        .doc(post.user.uid).collection("posts").doc(post.postId);

    const addLike = async () => {

        setLikeCount((prev) => prev + 1)

        await userPosts.set({
            likedBy: arrayUnion(user.uid)
        }, { merge: true })
            .catch((err) => {
                console.log(err)
            })
        setIsLiked(true);
        console.log('post liked')
    };

    const removeLike = async () => {

        setLikeCount(0);

        await userPosts.set({
            likedBy: arrayRemove(user.uid)
        }, { merge: true })
            .catch((err) => {
                console.log(err)
            })
        console.log('post like removed')
        setIsLiked(false);

    }

    const updateLikeCount = async () => {

        const postRef = collectionGroup(fbFireStore, "posts",);
        const qPosts = query(postRef, where('postId', '==', post.postId));

        const docSnap = await getDocs(qPosts);

        let postData = docSnap.docs.map(doc => ({ ...doc.data() }));

        setTotalLikes(postData[0].likedBy.length);
        setIsLiked(post.likedBy.includes(user.uid));

    };

    useEffect(() => {
        updateLikeCount();

    }, [likeCount]);

  
    return (
        <Box fontSize="2rem">
            <Text>
                {totalLikes}
            </Text>



            {isLiked ?


                <FcLike onClick={removeLike} />
                :
                <FcLikePlaceholder onClick={addLike} />

            }


        </Box>
    )
}

export default LikeButton;