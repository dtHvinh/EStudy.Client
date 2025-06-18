"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [timeInput, setTimeInput] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const presetOptions = [
    { value: "5", label: "5 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "25", label: "25 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
    { value: "custom", label: "Custom time" },
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeSelect = (value: string) => {
    if (value !== "custom") {
      const minutes = Number.parseInt(value);
      const seconds = minutes * 60;
      setTimeLeft(seconds);
      setInitialTime(seconds);
      setTimeInput(value);
    } else {
      setTimeInput("");
    }
    setIsRunning(false);
  };

  const handleCustomInput = (value: string) => {
    setTimeInput(value);
    const minutes = Number.parseInt(value);
    if (minutes > 0 && minutes <= 999) {
      const seconds = minutes * 60;
      setTimeLeft(seconds);
      setInitialTime(seconds);
      setIsRunning(false);
    }
  };

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const isCustom = !presetOptions.some(
    (option) => option.value === timeInput && option.value !== "custom"
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Focus Timer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Set your focus time and start
            </p>
          </div>

          {/* Time Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Select or enter time (minutes)
            </label>

            <div className="flex gap-2">
              <Select onValueChange={handleTimeSelect} disabled={isRunning}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Custom"
                value={timeInput}
                onChange={(e) => handleCustomInput(e.target.value)}
                className="w-20"
                min="1"
                max="999"
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center py-8">
            <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
              {formatTime(timeLeft)}
            </div>
            {timeLeft > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width:
                      initialTime > 0
                        ? `${((initialTime - timeLeft) / initialTime) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={toggleTimer}
              disabled={timeLeft === 0}
              size="lg"
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button
              onClick={resetTimer}
              disabled={timeLeft === initialTime}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Message */}
          {timeLeft === 0 && initialTime > 0 && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                🎉 Focus session complete!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
