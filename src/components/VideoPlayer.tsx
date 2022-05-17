import React from 'react';
import {VideoPlayerProps} from '../utils/types';

const VideoPlayer: React.FC<VideoPlayerProps> = ({videoLink}) => {
  return (
    <>
      <video controls autoPlay muted id="videoPlayer">
        <source src={videoLink} type="video/mp4" />
        <source src={videoLink} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default VideoPlayer;
