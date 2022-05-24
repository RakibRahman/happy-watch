import { Box, Flex, Button } from '@chakra-ui/react';
import React from 'react';
import { formatDraftText } from '../../lib/draft-utils';
import useVideo from '../../hooks/useVideo';
import { FaMusic, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { VscPlay } from 'react-icons/vsc';
import { PostProps } from '../../utils/types'
type Props = {
  post: PostProps;
};

const FeedPost: React.FC<Props> = ({ post }) => {
  const { isPlaying, togglePlay, isMuted, videoRef, setPlaying, toggleMute } = useVideo();

  return (
    <Box>
      <Box className="richEditor-box" dangerouslySetInnerHTML={{ __html: formatDraftText(post.content) }} />
      <Flex justify="center" textAlign="left">
        <Box>
        <Flex align="center" gap="5px">  <FaMusic /> {post.audio_name}</Flex>
          <Box  position='relative' mt={4}>

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
