import { useStorage } from "@/hooks/use-storage";
import { parseSRT } from "@/lib/srt-parser";
import { useVideoStateStore } from "@/stores/video-state-store";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { ReactPlayerProps } from "react-player/types";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const VideoPlayer = ({
  src,
  transcriptSrc,
  ...props
}: {
  src: string;
  transcriptSrc?: string;
} & ReactPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const { downloadFile } = useStorage();

  const { resetState, updateState, setSubtitleCues } = useVideoStateStore(
    useShallow((state) => ({
      resetState: state.resetState,
      updateState: state.updateState,
      playedSeconds: state.playedSeconds,
      setSubtitleCues: state.setSubtitleCues,
    })),
  );

  useEffect(() => {
    resetState();
  }, [src]);

  useEffect(() => {
    if (!transcriptSrc) return;
    let blob: Blob;
    const download = async () => {
      try {
        blob = await downloadFile(transcriptSrc);
        setSubtitleCues(parseSRT(await blob.text()));
      } catch (err) {
        toast.error("Failed to load transcript");
        console.error("Failed to load transcript:", err);
      }
    };

    download();
  }, [transcriptSrc]);

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      updateState({
        playedSeconds: currentTime,
        duration: playerRef.current.duration || 0,
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
