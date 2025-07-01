"use client";
import { WarningLevel } from "@/components/test-taking/count-down-timer";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

interface UseTestTimerProps {
  duration: number; // Duration in minutes
}

export function useTestTimer({ duration }: UseTestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(true);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) {
      if (timeRemaining <= 0) {
        setIsTimeUp(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const formatTime = useCallback((seconds: number) => {
    return dayjs.duration(seconds, "seconds").format("HH:mm:ss");
  }, []);

  const getTimeWarningLevel = useCallback((): WarningLevel => {
    const totalTime = duration * 60;
    const percentage = (timeRemaining / totalTime) * 100;

    if (percentage <= 5) return "critical";
    if (percentage <= 15) return "warning";
    return "normal";
  }, [timeRemaining, duration]);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(duration * 60);
    setIsActive(true);
    setIsTimeUp(false);
  }, [duration]);

  return {
    timeRemaining,
    isTimeUp,
    isActive,
    formatTime: formatTime(timeRemaining),
    warningLevel: getTimeWarningLevel(),
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
}
