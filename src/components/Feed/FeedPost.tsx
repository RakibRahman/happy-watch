import { Box, Flex, Button, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { formatDraftText } from '../../lib/draft-utils';
import useVideo from '../../hooks/useVideo';
import { FaMusic, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { VscPlay } from 'react-icons/vsc';
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { doc, updateDoc, getDoc, getDocs, collection, collectionGroup, where, query } from "firebase/firestore";
import { fbFireStore } from '../../lib/firebase';
import { PostProps } from '../../utils/types'
type Props = {
  post: PostProps;
};

const FeedPost: React.FC<Props> = ({ post }) => {
  const { isPlaying, togglePlay, isMuted, videoRef, setPlaying, toggleMute } = useVideo();
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
        likeCount: post.likeCount+likeCount
      }, { merge: true })
      .catch((err) => {
        console.log(err)
      })
};
useEffect(() => {
  updateLikeCount();
}, [likeCount])
return (
  <Box>
    <Box className="richEditor-box" dangerouslySetInnerHTML={{ __html: formatDraftText(post.content) }} />
    <Flex justify="center" textAlign="left">
      <Box>
        <Flex align="center" gap="5px">  <FaMusic /> {post.audio_name}</Flex>
        <Flex>
          <Box position='relative' mt={4}>

            <video
              ref={videoRef}
              src={post.videoUrl}
              playsInline
              loop
              muted={isMuted}
              className="videoPlayerFeed"
            />
            <ToggleVideoPlay isPlaying={isPlaying} togglePlay={togglePlay} />
            <ToggleVideoMute isMuted={isMuted} toggleMute={toggleMute} />
          </Box>
          <Box>
            <Text onClick={likeHandler}>{post.likeCount}
              {likeCount === 0 ? <FcLikePlaceholder /> : <FcLike />}
            </Text>
          </Box>
        </Flex>

      </Box>
    </Flex>
  </Box>
);
};

function ToggleVideoPlay({ isPlaying, togglePlay }: { isPlaying: boolean, togglePlay: () => void }) {
  return (
    <Button _hover={{
      opacity: 1,
    }}
      _focus={{
        outline: 'none'
      }}
      fontSize='lg' bg='transparent' color='white' position="absolute" bottom='0' onClick={() => togglePlay()}>{isPlaying ? <FaPause /> : <FaPlay />}</Button>
  )
};
function ToggleVideoMute({ isMuted, toggleMute }: { isMuted: boolean, toggleMute: () => void }) {
  return (
    <Button _hover={{
      opacity: 1,
    }}
      _focus={{
        outline: 'none'
      }}
      fontSize='lg' bg='transparent' color='white' position="absolute" bottom='0' right='0' onClick={toggleMute}>{isMuted ? <FaVolumeMute /> : <FaVolumeUp />}</Button>
  )
};

// function ToggleMute =
export default FeedPost;
