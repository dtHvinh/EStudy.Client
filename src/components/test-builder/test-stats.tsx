"use client";

import { Card, CardContent } from "@/components/ui/card";

interface TestStatsProps {
  sectionsCount: number;
  totalQuestions: number;
  totalPoints: number;
  duration: number;
  averageTimePerQuestion: number;
}

export function TestStats({
  sectionsCount,
  totalQuestions,
  totalPoints,
  duration,
  averageTimePerQuestion,
}: TestStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{sectionsCount}</div>
          <p className="text-muted-foreground text-xs">Sections</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{totalQuestions}</div>
          <p className="text-muted-foreground text-xs">Questions</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{totalPoints}</div>
          <p className="text-muted-foreground text-xs">Total Points</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{duration}m</div>
          <p className="text-muted-foreground text-xs">Duration</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{averageTimePerQuestion}m</div>
          <p className="text-muted-foreground text-xs">Avg/Question</p>
        </CardContent>
      </Card>
    </div>
  );
}
