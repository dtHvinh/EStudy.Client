import { SubtitleCue } from "@/lib/srt-parser";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { ReactPlayerProps } from "react-player/types";

const VideoPlayer = ({
  src,
  onTranscriptLoaded,
  ...props
}: {
  src: string;
  onTranscriptLoaded?: (cues: SubtitleCue[]) => void;
} & ReactPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const initialState = {
    playedSeconds: 0,
  };
  const [state, setState] = useState(initialState);

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      setState({
        playedSeconds: currentTime,
      });
    }
  };

  return (
    <ReactPlayer
      ref={playerRef}
      src={src}
      {...props}
      onTimeUpdate={handleTimeUpdate}
    ></ReactPlayer>
  );
};

export default VideoPlayer;
