import React from 'react';
import {VideoPlayerProps} from '../utils/types';

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoLink,
  showControl = false,
  isLoop = true,
}) => {
  return (
    <>
      <video
        controls={showControl ? true : false}
        autoPlay
        muted
        id="videoPlayer"
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
