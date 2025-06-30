"use client";

import { WarningLevel } from "@/components/test-taking/count-down-timer";
import { useCallback, useEffect, useState } from "react";

export function useCountdown(initialMinutes: number) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialMinutes * 60);
    setIsActive(false);
    setIsTimeUp(false);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimeUp(true);
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimeUp(true);
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getTimeWarningLevel = useCallback(() => {
    const totalTime = initialMinutes * 60;
    const percentage = (timeLeft / totalTime) * 100;

    if (percentage <= 5) return "critical"; // Last 5%
    if (percentage <= 15) return "warning"; // Last 15%
    return "normal" as WarningLevel;
  }, [timeLeft, initialMinutes]);

  return {
    timeLeft,
    isActive,
    isTimeUp,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime: formatTime(timeLeft),
    warningLevel: getTimeWarningLevel(),
  };
}
