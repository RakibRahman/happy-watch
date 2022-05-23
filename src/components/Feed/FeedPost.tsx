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
    <>
      <Box dangerouslySetInnerHTML={{ __html: formatDraftText(post.content) }} />
      <Flex>
        <Box>
          <FaMusic /> {post.audio_name}
          <Box position='relative'>

            <video
              ref={videoRef}
              src={post.videoUrl}
              playsInline
              loop
              muted={isMuted}
              className="videoPlayer"
            />
            <ToggleVideoPlay isPlaying={isPlaying} togglePlay={togglePlay} />
            <ToggleVideoMute isMuted={isMuted} toggleMute={toggleMute} />
          </Box>

        </Box>
      </Flex>
    </>
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
