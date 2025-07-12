import { useStorage } from "@/hooks/use-storage";
import { parseSRT } from "@/lib/srt-parser";
import { convertSRTTextToVTT } from "@/lib/vtt-parser";
import { useVideoStateStore } from "@/stores/video-state-store";
import { useEffect, useRef, useState } from "react";
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
  const playerRef = useRef<HTMLVideoElement>(null);
  const { downloadFile } = useStorage();
  const [vttUrl, setVttUrl] = useState<string>();

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
  }, [src, transcriptSrc]);

  useEffect(() => {
    if (!transcriptSrc) return;

    const loadTranscript = async () => {
      try {
        const blob = await downloadFile(transcriptSrc);
        const text = await blob.text();

        // Set subtitle cues for the sidebar
        setSubtitleCues(parseSRT(text));

        // Set VTT URL for video player
        if (transcriptSrc.endsWith(".vtt")) {
          setVttUrl(transcriptSrc);
        } else {
          const vttBlob = convertSRTTextToVTT(text);
          const vttUrl = URL.createObjectURL(vttBlob);
          setVttUrl(vttUrl);
        }
      } catch (err) {
        toast.error("Failed to load transcript");
        console.error("Failed to load transcript:", err);
      }
    };

    loadTranscript();
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
      controls={true}
      crossOrigin="anonymous"
    >
      {vttUrl && (
        <track
          kind="subtitles"
          src={vttUrl}
          srcLang="en"
          label="English subtitles"
        />
      )}
    </ReactPlayer>
  );
};

export default VideoPlayer;
