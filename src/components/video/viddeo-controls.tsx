import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const VideoControls: React.FC<VideoControlsProps> = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (video) video.volume = vol;
    if (video) setIsMuted(video.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (video) video.currentTime = time;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
  };

  return (
    <div className="flex w-full flex-col gap-2 bg-black/60 p-4 text-white">
      {/* Time + Seekbar */}
      <div className="flex items-center gap-3">
        <span className="w-12 text-xs">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 cursor-pointer"
        />
        <span className="w-12 text-right text-xs">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button onClick={togglePlay} className="hover:text-blue-400">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button onClick={toggleMute} className="hover:text-blue-400">
          {isMuted || volume === 0 ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 cursor-pointer"
        />

        <button
          onClick={handleFullscreen}
          className="ml-auto hover:text-blue-400"
        >
          <Maximize2 size={20} />
        </button>
      </div>
    </div>
  );
};
