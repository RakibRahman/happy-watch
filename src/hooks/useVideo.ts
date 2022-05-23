import { useRef, useState } from 'react';


export default function useVideo() {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setPlaying] = useState(false);
    // const [togglePlay, setTogglePlay] = useState(false);

    const togglePlay = (e?: MouseEvent):void => {
        e?.stopPropagation();
        console.log(videoRef);
        if (isPlaying) {
            videoRef.current?.pause();
            setPlaying(false);
          } else {
            videoRef.current?.play();
            setPlaying(true);
          }
        console.log('video is playing:',isPlaying);
    };

    const toggleMute =()=> setIsMuted((prev) => !prev);

    return { isMuted, videoRef, togglePlay, setPlaying, isPlaying, toggleMute };
}