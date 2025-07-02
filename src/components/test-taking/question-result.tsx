"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TestResult } from "@/stores/use-test-results";
import {
  AlertCircle,
  CheckCircle,
  CheckSquare,
  Circle,
  XCircle,
} from "lucide-react";

interface QuestionResultProps {
  result: TestResult;
  questionNumber: number;
}

export function QuestionResult({
  result,
  questionNumber,
}: QuestionResultProps) {
  const { question, userAnswerIds, correctAnswerIds, isCorrect, earnedPoints } =
    result;

  const getUserAnswerTexts = () => {
    return question.answers
      .filter((answer) => userAnswerIds.includes(answer.id))
      .map((answer) => answer.text);
  };

  const getCorrectAnswerTexts = () => {
    return question.answers
      .filter((answer) => correctAnswerIds.includes(answer.id))
      .map((answer) => answer.text);
  };

  const userAnswerTexts = getUserAnswerTexts();
  const correctAnswerTexts = getCorrectAnswerTexts();
  const wasAnswered = userAnswerIds.length > 0;

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isCorrect && wasAnswered
          ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50"
          : wasAnswered
            ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50"
            : "border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50",
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {result.section.title}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Question {questionNumber}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs capitalize",
                  question.type === "multiple-choice"
                    ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
                )}
              >
                {question.type === "multiple-choice" ? (
                  <CheckSquare className="mr-1 h-3 w-3" />
                ) : (
                  <Circle className="mr-1 h-3 w-3" />
                )}
                {question.type.replace("-", " ")}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {question.text}
            </CardTitle>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {earnedPoints}/{question.points} pts
            </Badge>
            {wasAnswered ? (
              isCorrect ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              )
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Answer Options */}
        <div className="space-y-3">
          {question.answers.map((answer) => {
            const isUserSelected = userAnswerIds.includes(answer.id);
            const isCorrectAnswer = answer.isCorrect;

            let answerStyle = "border-border bg-background";
            let iconElement = null;

            if (isCorrectAnswer && isUserSelected) {
              // User selected correct answer
              answerStyle =
                "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950";
              iconElement = <CheckCircle className="h-4 w-4 text-green-600" />;
            } else if (isCorrectAnswer && !isUserSelected) {
              // Correct answer not selected by user
              answerStyle =
                "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950";
              iconElement = <CheckCircle className="h-4 w-4 text-green-600" />;
            } else if (!isCorrectAnswer && isUserSelected) {
              // User selected incorrect answer
              answerStyle =
                "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950";
              iconElement = <XCircle className="h-4 w-4 text-red-600" />;
            }

            return (
              <div
                key={answer.id}
                className={cn(
                  "flex items-start space-x-3 rounded-lg border p-3 transition-colors",
                  answerStyle,
                )}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {iconElement ||
                    (question.type === "multiple-choice" ? (
                      <CheckSquare className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Circle className="text-muted-foreground h-4 w-4" />
                    ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{answer.text}</p>
                  {isUserSelected && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      Your Answer
                    </Badge>
                  )}
                  {isCorrectAnswer && (
                    <Badge
                      variant="outline"
                      className="mt-1 ml-2 border-green-300 bg-green-50 text-xs text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300"
                    >
                      Correct Answer
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Result Summary */}
        <div
          className={cn(
            "rounded-lg border-l-4 p-4",
            isCorrect && wasAnswered
              ? "border-l-green-500 bg-green-50 dark:bg-green-950"
              : wasAnswered
                ? "border-l-red-500 bg-red-50 dark:bg-red-950"
                : "border-l-orange-500 bg-orange-50 dark:bg-orange-950",
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            {wasAnswered ? (
              isCorrect ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Incorrect
                  </span>
                </>
              )
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800 dark:text-orange-200">
                  Not Answered
                </span>
              </>
            )}
          </div>

          {wasAnswered && (
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Your answer:</span>{" "}
                {userAnswerTexts.length > 0
                  ? userAnswerTexts.join(", ")
                  : "None"}
              </p>
              <p>
                <span className="font-medium">Correct answer:</span>{" "}
                {correctAnswerTexts.join(", ")}
              </p>
            </div>
          )}

          {!wasAnswered && (
            <div className="text-sm">
              <p>
                <span className="font-medium">Correct answer:</span>{" "}
                {correctAnswerTexts.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Explanation */}
        {question.explanation && (!isCorrect || !wasAnswered) && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <div>
                <h4 className="mb-1 font-medium text-blue-800 dark:text-blue-200">
                  Explanation
                </h4>
                <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
