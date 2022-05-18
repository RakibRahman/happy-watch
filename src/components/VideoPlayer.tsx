import React from 'react';
import {VideoPlayerProps} from '../utils/types';

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoLink,
  showControl = false,
}) => {
  return (
    <>
      <video
        controls={showControl ? true : false}
        autoPlay
        muted
        id="videoPlayer"
        loop
      >
        <source src={videoLink} type="video/mp4" />
        <source src={videoLink} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default VideoPlayer;
