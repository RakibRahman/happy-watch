import React from 'react';
import { VideoPlayerProps } from '../utils/types';
import useVideo from '../hooks/useVideo';

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoLink,
  showControl = false,
  isLoop = true,
  autoPlay = true,
  muted = true,
  videoRef,
}) => {
  const {videoRef:vRef} =useVideo();
  return (
    <>
      <video
        ref={vRef}
        playsInline
        controls={showControl ? true : false}
        autoPlay={autoPlay ? true : false}
        muted={muted ? true : false}
        className="videoPlayer"
        loop={isLoop ? true : false}

      >
        <source src={videoLink} type="video/mp4" />
        <source src={videoLink} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default VideoPlayer;
