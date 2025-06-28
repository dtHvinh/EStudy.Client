"use client";

import { Clock, FileText, MessageSquare, Users } from "lucide-react";

interface TestStatsGridProps {
  duration: number;
  questionCount: number;
  attemptCount: number;
  commentCount: number;
}

export function TestStatsGrid({
  duration,
  questionCount,
  attemptCount,
  commentCount,
}: TestStatsGridProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  const stats = [
    {
      icon: Clock,
      value: formatDuration(duration),
      label: "Duration",
    },
    {
      icon: FileText,
      value: questionCount.toString(),
      label: "Questions",
    },
    {
      icon: Users,
      value: attemptCount.toLocaleString(),
      label: "Attempts",
    },
    {
      icon: MessageSquare,
      value: commentCount.toString(),
      label: "Comments",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-muted/50 flex items-center gap-2 rounded-lg p-3"
          >
            <Icon className="text-primary h-5 w-5" />
            <div>
              <p className="text-sm font-medium">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
