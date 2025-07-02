"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestTakingType, UserAnswer } from "@/hooks/use-test-taking";
import { useTestResults } from "@/stores/use-test-results";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Filter,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { QuestionResult } from "./question-result";
import TestResultsSummaryComp from "./test-results-summary";

interface TestResultsPageProps {
  testData: TestTakingType;
  userAnswers: UserAnswer[];
  timeSpent?: number;
  onRetakeTest?: () => void;
  onBackToTests?: () => void;
}

export function TestResultsPage({
  testData,
  userAnswers,
  timeSpent = 0,
  onRetakeTest,
  onBackToTests,
}: TestResultsPageProps) {
  const [filterType, setFilterType] = useState<
    "all" | "correct" | "incorrect" | "unanswered"
  >("all");
  const { results, summary } = useTestResults(testData, userAnswers, timeSpent);

  const filteredResults = results.filter((result) => {
    switch (filterType) {
      case "correct":
        return result.isCorrect && result.userAnswerIds.length > 0;
      case "incorrect":
        return !result.isCorrect && result.userAnswerIds.length > 0;
      case "unanswered":
        return result.userAnswerIds.length === 0;
      default:
        return true;
    }
  });

  const getFilterCount = (type: typeof filterType) => {
    switch (type) {
      case "correct":
        return results.filter((r) => r.isCorrect && r.userAnswerIds.length > 0)
          .length;
      case "incorrect":
        return results.filter((r) => !r.isCorrect && r.userAnswerIds.length > 0)
          .length;
      case "unanswered":
        return results.filter((r) => r.userAnswerIds.length === 0).length;
      default:
        return results.length;
    }
  };

  return (
    results &&
    summary && (
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold">Test Results</h1>
              <p className="text-muted-foreground">{testData.title}</p>
            </div>
            <div className="flex items-center gap-2">
              {onBackToTests && (
                <Button
                  variant="outline"
                  onClick={onBackToTests}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tests
                </Button>
              )}
              {onRetakeTest && (
                <Button
                  onClick={onRetakeTest}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake Test
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Review</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <TestResultsSummaryComp
              summary={summary}
              testTitle={testData.title}
            />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {/* Filter Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Question Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                    className="flex items-center gap-2"
                  >
                    All Questions
                    <Badge variant="secondary" className="text-xs">
                      {getFilterCount("all")}
                    </Badge>
                  </Button>
                  <Button
                    variant={filterType === "correct" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("correct")}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Correct
                    <Badge variant="secondary" className="text-xs">
                      {getFilterCount("correct")}
                    </Badge>
                  </Button>
                  <Button
                    variant={filterType === "incorrect" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("incorrect")}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-3 w-3 text-red-600" />
                    Incorrect
                    <Badge variant="secondary" className="text-xs">
                      {getFilterCount("incorrect")}
                    </Badge>
                  </Button>
                  <Button
                    variant={
                      filterType === "unanswered" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterType("unanswered")}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="h-3 w-3 text-orange-600" />
                    Unanswered
                    <Badge variant="secondary" className="text-xs">
                      {getFilterCount("unanswered")}
                    </Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Question Results */}
            <div className="space-y-4">
              {filteredResults && filteredResults.length > 0 ? (
                filteredResults.map((result, index) => {
                  // Calculate the original question number
                  const originalIndex = results.findIndex(
                    (r) => r.questionId === result.questionId,
                  );
                  return (
                    <QuestionResult
                      key={result.questionId}
                      result={result}
                      questionNumber={originalIndex + 1}
                    />
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No questions match the selected filter.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  );
}
