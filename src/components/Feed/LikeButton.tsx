import React, { useState, useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react';
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { doc, updateDoc, getDoc, getDocs, collection, collectionGroup, where, query } from "firebase/firestore";
import { fbFireStore } from '../../lib/firebase';
import { PostProps } from '../../utils/types';

type Props = {
    post: PostProps
}
const LikeButton: React.FC<Props> = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const likeHandler = () => {
        if (likeCount === 0) {
            setLikeCount((prev) => prev + 1);
        }
        if (likeCount > 0) {
            setLikeCount(0);
        }
    };

    const updateLikeCount = async () => {
        //     const postRef = collectionGroup(fbFireStore, "posts",);
        //     const qPosts = query(postRef, where('postId', '==','hF_fTsNAer'));

        //     const docSnap = await getDocs(qPosts);

        //     let postData = docSnap.docs.map(doc => ({ ...doc.data() }));

        // console.log(postData[0]);

        const userPosts = fbFireStore.collection('users')
            .doc(post.user.uid).collection("posts").doc(post.postId);

        await userPosts.set({
            likeCount: post.likeCount + likeCount
        }, { merge: true })
            .catch((err) => {
                console.log(err)
            })


    };
    useEffect(() => {
        updateLikeCount();
    }, [likeCount]);
    return (
        <Box>
            <Flex flexDirection='column' align="center" onClick={likeHandler}>{post.likeCount}
                {likeCount === 0 ? <FcLikePlaceholder /> : <FcLike />}
            </Flex>
        </Box>
    )
}

export default LikeButton;