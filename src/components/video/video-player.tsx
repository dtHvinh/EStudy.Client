import useStorageV2 from "@/hooks/use-storage-v2";
import { parseSRT, parseVTT } from "@/lib/srt-parser";
import { convertSRTTextToVTT } from "@/lib/vtt-parser";
import { useVideoStateStore } from "@/stores/video-state-store";
import { useEffect, useRef, useState } from "react";
import { InView } from "react-intersection-observer";
import ReactPlayer from "react-player";
import { ReactPlayerProps } from "react-player/types";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export type VideoProps = {
  autoPip?: boolean;
};

const VideoPlayer = ({
  src,
  transcriptSrc,
  autoPip = false,
  ...props
}: {
  src: string;
  transcriptSrc?: string;
} & ReactPlayerProps &
  VideoProps) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const { downloadBlob } = useStorageV2();
  const [vttUrl, setVttUrl] = useState<string>();

  const { resetState, updateState, setSubtitleCues } = useVideoStateStore(
    useShallow((state) => ({
      resetState: state.resetState,
      updateState: state.updateState,
      playedSeconds: state.playedSeconds,
      setSubtitleCues: state.setSubtitleCues,
      seekToTime: state.seekToTime,
    })),
  );

  const sub1 = useVideoStateStore.subscribe((state) => {
    if (state.seekToTime !== undefined && playerRef.current) {
      playerRef.current.currentTime = state.seekToTime;
      updateState({ seekToTime: undefined });
    }
  });

  const onVideoInViewStatusChange = async (inView: boolean) => {
    if (playerRef.current && !inView && autoPip) {
      await playerRef.current?.requestPictureInPicture();
    }
  };

  useEffect(() => {
    resetState();
  }, [src, transcriptSrc]);

  useEffect(() => {
    if (!transcriptSrc) return;

    const isVTT = transcriptSrc.endsWith(".vtt");

    const loadTranscript = async () => {
      try {
        const blob = await downloadBlob(transcriptSrc);
        const text = await blob.text();

        // Set subtitle cues for the sidebar
        setSubtitleCues(!isVTT ? parseSRT(text) : parseVTT(text));

        if (isVTT) {
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
    <InView threshold={0.5} onChange={onVideoInViewStatusChange}>
      <ReactPlayer
        ref={playerRef}
        src={src}
        {...props}
        onTimeUpdate={handleTimeUpdate}
        onSeeked={handleTimeUpdate}
        controls={true}
        crossOrigin="anonymous"
        autoPlay
      >
        {vttUrl && (
          <track
            kind="subtitles"
            src={vttUrl}
            srcLang="en"
            label="English subtitles"
            default
          />
        )}
      </ReactPlayer>
    </InView>
  );
};

export default VideoPlayer;
