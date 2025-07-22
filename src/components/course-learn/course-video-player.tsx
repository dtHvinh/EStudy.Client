"use client";

import type { GetCourseToLearnLessonResponse } from "@/hooks/use-learn-course";
import useStorageV2 from "@/hooks/use-storage-v2";
import { Check, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import VideoPlayer from "../video/video-player";

interface CourseVideoPlayerProps {
  lesson: GetCourseToLearnLessonResponse;
  onLessonCompleted?: (lessonId: number) => void;
}

export default function CourseVideoPlayer({
  lesson,
  onLessonCompleted,
}: CourseVideoPlayerProps) {
  const { getFileUrl } = useStorageV2();
  const [videoEnded, setVideoEnded] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoEnded && countdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (videoEnded && countdown === 0) {
      onLessonCompleted?.(lesson.id);
      setVideoEnded(false); // Reset for potential replay
    }

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [videoEnded, countdown, lesson.id, onLessonCompleted]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    setCountdown(5);
  };

  const handleSkipCountdown = () => {
    onLessonCompleted?.(lesson.id);
    setVideoEnded(false);
  };

  if (!lesson.videoUrl) {
    return (
      <div className="bg-muted flex h-full items-center justify-center">
        <div className="p-8 text-center">
          <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-bold">{lesson.title}</h2>
          <Badge variant="secondary">Text Lesson</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black">
      <VideoPlayer
        src={getFileUrl(lesson.videoUrl)}
        transcriptSrc={lesson.transcriptUrl && getFileUrl(lesson.transcriptUrl)}
        width="100%"
        height="100%"
        controls={true}
        onEnded={handleVideoEnded}
      />

      {/* Video End Overlay with Countdown */}
      {videoEnded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-500">
                  <span className="text-4xl font-bold text-white">
                    {countdown}
                  </span>
                </div>
                <svg
                  className="absolute inset-0"
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(34, 197, 94, 0.2)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeDasharray="301.59"
                    strokeDashoffset={301.59 * (1 - countdown / 5)}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            {!lesson.isCompleted && (
              <>
                <h3 className="mb-6 text-2xl font-bold text-white">
                  Marking as completed in {countdown} seconds...
                </h3>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleSkipCountdown}
                    className="gap-2 bg-white text-black hover:bg-white/90 hover:text-black/90"
                  >
                    <Check className="h-4 w-4" />
                    Mark as completed now
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
