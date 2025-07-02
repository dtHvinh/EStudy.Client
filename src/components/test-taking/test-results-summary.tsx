"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { TestResultsSummary } from "@/stores/use-test-results";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

interface TestResultsSummaryCompProps {
  summary: TestResultsSummary;
  testTitle: string;
}

export default function TestResultsSummaryComp({
  summary,
  testTitle,
}: TestResultsSummaryCompProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <Card
        className={cn(
          "border-2",
          summary.passed
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
        )}
      >
        <CardHeader className="text-center">
          <div className="mb-4 flex items-center justify-center">
            {summary.passed ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <Target className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="mb-2 text-2xl">
            {summary.passed ? "Congratulations!" : "Test Completed"}
          </CardTitle>
          <div className="space-y-2">
            <Badge
              variant={summary.passed ? "default" : "destructive"}
              className="px-4 py-2 text-lg"
            >
              {summary.passed ? "PASSED" : "NOT PASSED"}
            </Badge>
            <p className="text-muted-foreground">{testTitle}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div
                  className={cn(
                    "text-4xl font-bold",
                    getGradeColor(summary.percentage),
                  )}
                >
                  {Math.round(summary.percentage)}%
                </div>
                <div className="text-muted-foreground text-sm">Final Score</div>
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "text-4xl font-bold",
                    getGradeColor(summary.percentage),
                  )}
                >
                  {getGradeLetter(summary.percentage)}
                </div>
                <div className="text-muted-foreground text-sm">Grade</div>
              </div>
            </div>
            <Progress value={summary.percentage} className="h-3" />
            <div className="text-muted-foreground text-sm">
              {summary.earnedPoints} out of {summary.totalPoints} points earned
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-background rounded-lg border p-3 text-center">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-green-600" />
              <div className="font-semibold text-green-600">
                {summary.correctAnswers}
              </div>
              <div className="text-muted-foreground text-xs">Correct</div>
            </div>
            <div className="bg-background rounded-lg border p-3 text-center">
              <XCircle className="mx-auto mb-2 h-6 w-6 text-red-600" />
              <div className="font-semibold text-red-600">
                {summary.incorrectAnswers}
              </div>
              <div className="text-muted-foreground text-xs">Incorrect</div>
            </div>
            <div className="bg-background rounded-lg border p-3 text-center">
              <Clock className="mx-auto mb-2 h-6 w-6 text-blue-600" />
              <div className="font-semibold text-blue-600">
                {formatTime(summary.timeSpent)}
              </div>
              <div className="text-muted-foreground text-xs">Time Spent</div>
            </div>
            <div className="bg-background rounded-lg border p-3 text-center">
              <BookOpen className="mx-auto mb-2 h-6 w-6 text-purple-600" />
              <div className="font-semibold text-purple-600">
                {summary.answeredQuestions}
              </div>
              <div className="text-muted-foreground text-xs">Answered</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Section Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summary.sectionResults.map((sectionResult, index) => (
            <div key={sectionResult.section.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{sectionResult.section.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {sectionResult.correctAnswers} of{" "}
                    {sectionResult.totalQuestions} correct
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "font-semibold",
                      getGradeColor(sectionResult.percentage),
                    )}
                  >
                    {Math.round(sectionResult.percentage)}%
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {sectionResult.earnedPoints}/{sectionResult.totalPoints} pts
                  </div>
                </div>
              </div>
              <Progress value={sectionResult.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
