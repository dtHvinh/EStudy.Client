"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Clock,
  Download,
  ExternalLink,
  FileText,
  ImageIcon,
  Maximize,
  Music,
  Pause,
  Play,
  Video,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface MediaRendererProps {
  url: string;
  title?: string;
  description?: string;
  alt?: string;
  className?: string;
  autoPlay?: boolean;
  showOverlay?: boolean;
  aspectRatio?: "square" | "video" | "auto";
  onDelete?: (e: React.MouseEvent) => void;
}

export default function MediaRenderer({
  url,
  title,
  description,
  alt = "Media content",
  className,
  autoPlay = false,
  showOverlay = true,
  aspectRatio = "auto",
  onDelete,
}: MediaRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const ext = url.split(".").pop()?.toLowerCase() || "";
  const filename = url.split("/").pop()?.split("?")[0] || "media";
  const displayTitle = title || filename;

  const isImage = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
    "ico",
  ].includes(ext);
  const isVideo = [
    "mp4",
    "webm",
    "ogg",
    "avi",
    "mov",
    "wmv",
    "flv",
    "mkv",
  ].includes(ext);
  const isAudio = ["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"].includes(
    ext,
  );
  const isPdf = ext === "pdf";

  const getMediaIcon = () => {
    if (isImage) return <ImageIcon className="h-4 w-4" />;
    if (isVideo) return <Video className="h-4 w-4" />;
    if (isAudio) return <Music className="h-4 w-4" />;
    if (isPdf) return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getMediaType = () => {
    if (isImage) return "Image";
    if (isVideo) return "Video";
    if (isAudio) return "Audio";
    if (isPdf) return "PDF";
    return "File";
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else if (isAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVideo && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (isAudio && audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVideo && videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      default:
        return "";
    }
  };

  const renderOverlay = () => {
    if (!showOverlay || !isHovered) return null;

    return (
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
        {/* Top section with media type and external link */}
        <div className="flex items-start justify-between">
          <Badge
            variant="secondary"
            className="border-white/20 bg-black/60 text-white"
          >
            <span className="flex items-center gap-1">
              {getMediaIcon()}
              {getMediaType()}
            </span>
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white"
            onClick={handleExternalLink}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Center controls for video/audio */}
        {(isVideo || isAudio) && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black/60 p-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-10 w-10 rounded-full p-0 text-white"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full p-0 text-white"
                onClick={handleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              {isVideo && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-full p-0 text-white"
                  onClick={handleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Bottom section with title, description, and actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium text-white">
                {displayTitle}
              </h3>
              {description && (
                <p className="mt-1 line-clamp-2 text-xs text-white/80">
                  {description}
                </p>
              )}
              {duration && (
                <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(duration)}</span>
                  {(isVideo || isAudio) && isPlaying && (
                    <>
                      <span>•</span>
                      <span>{formatTime(currentTime)}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="ml-2 h-8 w-8 p-0 text-white"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
            <DeleteButton onClick={onDelete} />
          </div>
        </div>
      </div>
    );
  };

  const renderImage = () => (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg",
        getAspectRatioClass(),
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={url || "/placeholder.svg"}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setError(true)}
        loading="lazy"
      />
      {renderOverlay()}
    </div>
  );

  const renderVideo = () => (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg",
        getAspectRatioClass(),
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={url}
        className="h-full w-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setError(true)}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        autoPlay={autoPlay}
        muted={autoPlay}
        playsInline
        loop={autoPlay}
      />
      {renderOverlay()}
    </div>
  );

  const renderAudio = () => (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg",
        getAspectRatioClass() || "aspect-[3/1]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
        <div className="z-10 text-center text-white">
          <Music className="mx-auto mb-2 h-12 w-12 opacity-80" />
          <p className="max-w-[200px] truncate text-sm font-medium opacity-90">
            {displayTitle}
          </p>
        </div>
        {/* Animated background */}
        <div className="absolute inset-0 -skew-x-12 transform animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setError(true)}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        className="hidden"
      />
      {renderOverlay()}
    </div>
  );

  const renderPdf = () => (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg",
        getAspectRatioClass() || "aspect-[3/4]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-full w-full items-center justify-center border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <FileText className="mx-auto mb-3 h-16 w-16 text-red-600" />
          <p className="max-w-[200px] truncate text-sm font-medium text-red-800">
            {displayTitle}
          </p>
          <p className="mt-1 text-xs text-red-600">PDF Document</p>
        </div>
      </div>
      {renderOverlay()}
    </div>
  );

  const renderFallback = () => (
    <div
      ref={containerRef}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg",
        getAspectRatioClass() || "aspect-square",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-full w-full items-center justify-center border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <FileText className="mx-auto mb-3 h-16 w-16 text-gray-600" />
          <p className="max-w-[200px] truncate text-sm font-medium text-gray-800">
            {displayTitle}
          </p>
          <p className="mt-1 text-xs text-gray-600">Unknown file type</p>
        </div>
      </div>
      {renderOverlay()}
    </div>
  );

  const renderError = () => (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-lg border-2 border-red-200 bg-red-50",
        getAspectRatioClass() || "aspect-square",
        className,
      )}
    >
      <div className="p-8 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl font-bold text-red-600">!</span>
        </div>
        <p className="text-sm font-medium text-red-800">Failed to load media</p>
        <p className="mt-1 text-xs text-red-600">Please check the URL</p>
      </div>
    </div>
  );

  if (error) {
    return renderError();
  }

  if (isImage) return renderImage();
  if (isVideo) return renderVideo();
  if (isAudio) return renderAudio();
  if (isPdf) return renderPdf();
  return renderFallback();
}

const DeleteButton = ({
  onClick,
}: {
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="ml-2 h-8 w-8 p-0 text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this media?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
