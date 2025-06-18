"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";

interface CountdownTimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

export default function FocusTimer({
  initialSeconds = 60,
  onComplete,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("1");
  const [inputSeconds, setInputSeconds] = useState("0");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load audio on component mount
  useEffect(() => {
    audioRef.current = new Audio("/audio/count-down-4.wav");
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => {
          if (seconds == 4 && seconds > 0 && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
          }
          return seconds - 1;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onComplete?.();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onComplete]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };
  const handleReset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  const handleSetTime = () => {
    const totalSeconds = parseInt(inputMinutes) * 60 + parseInt(inputSeconds);
    if (totalSeconds > 0) {
      setSeconds(totalSeconds);
      setDialogOpen(false);
      setIsActive(true);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Label>Timer</Label>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Button
          variant="outline"
          size="sm"
          className="font-mono min-w-[60px]"
          onClick={() => {
            if (!isActive && seconds === initialSeconds) {
              setDialogOpen(true);
            } else if (seconds === 0) {
              handleReset();
            } else if (isActive) {
              handlePause();
            } else {
              handleStart();
            }
          }}
        >
          {formatTime(seconds)}
        </Button>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Timer</DialogTitle>
            <DialogDescription>
              Set the number of minutes and seconds for your focus timer.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                placeholder="Please enter minutes"
                clearable={false}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seconds">Seconds</Label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={inputSeconds}
                onChange={(e) => setInputSeconds(e.target.value)}
                placeholder="Please enter seconds"
                clearable={false}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSetTime}>Start Timer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {seconds !== initialSeconds && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 text-xs"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
