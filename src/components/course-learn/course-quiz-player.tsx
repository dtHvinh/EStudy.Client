"use client";

import type { GetCourseToLearnQuizResponse } from "@/hooks/use-learn-course";
import { CheckCircle, FileText, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface QuizAnswer {
  questionId: number;
  selectedOptionId: number;
}

interface CourseQuizPlayerProps {
  quiz: GetCourseToLearnQuizResponse;
  onQuizCompleted?: (quizId: number, score: number) => void;
}

export default function CourseQuizPlayer({
  quiz,
  onQuizCompleted,
}: CourseQuizPlayerProps) {
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setQuizAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId
            ? { ...a, selectedOptionId: optionId }
            : a,
        );
      }
      return [...prev, { questionId, selectedOptionId: optionId }];
    });
  };

  const getSelectedAnswer = (questionId: number) => {
    return quizAnswers.find((a) => a.questionId === questionId)
      ?.selectedOptionId;
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question) => {
      const selectedAnswer = getSelectedAnswer(question.id);
      const correctOption = question.options.find((opt) => opt.isCorrect);
      if (selectedAnswer === correctOption?.id) {
        correct++;
      }
    });

    const total = quiz.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, total, percentage };
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    if (score.percentage == 100) onQuizCompleted?.(quiz.id, score.percentage);
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers([]);
    setShowResults(false);
  };

  const isQuizComplete = quizAnswers.length === quiz.questions.length;
  const score = calculateScore();
  const progress =
    quiz.questions.length > 0
      ? (quizAnswers.length / quiz.questions.length) * 100
      : 0;

  return (
    <div className="relative overflow-hidden">
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          {/* Quiz Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900">
              <FileText className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Quiz
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-muted-foreground text-lg">
                {quiz.description}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {!showResults && (
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>
                  {quizAnswers.length} of {quiz.questions.length} questions
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Results View */}
          {showResults && (
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                <CardDescription>
                  You scored {score.correct} out of {score.total} questions
                  correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {score.percentage}%
                  </div>
                  <div className="text-muted-foreground">Final Score</div>
                </div>
                <Button
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className="mr-4 bg-transparent"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          <Carousel>
            <CarouselContent>
              {quiz.questions.map((question, index) => {
                const selectedAnswer = getSelectedAnswer(question.id);
                const correctOption = question.options.find(
                  (opt) => opt.isCorrect,
                );

                return (
                  <CarouselItem key={question.id}>
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">
                            <span className="text-muted-foreground mr-2">
                              {index + 1}.
                            </span>
                            {question.text}
                          </CardTitle>
                          {showResults && (
                            <div className="ml-4">
                              {selectedAnswer === correctOption?.id ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              ) : (
                                <XCircle className="h-6 w-6 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={selectedAnswer?.toString()}
                          onValueChange={(value) =>
                            handleAnswerChange(
                              question.id,
                              Number.parseInt(value),
                            )
                          }
                          disabled={showResults}
                        >
                          {question.options.map((option) => {
                            const isSelected = selectedAnswer === option.id;
                            const isCorrect = option.isCorrect;

                            let optionClassName =
                              "flex items-center space-x-3 rounded-lg border p-4 transition-colors";

                            if (showResults) {
                              if (isCorrect) {
                                optionClassName +=
                                  " border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
                              } else if (isSelected && !isCorrect) {
                                optionClassName +=
                                  " border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950";
                              }
                            } else if (isSelected) {
                              optionClassName +=
                                " border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
                            } else {
                              optionClassName += " hover:bg-muted";
                            }

                            return (
                              <div key={option.id} className={optionClassName}>
                                <RadioGroupItem
                                  value={option.id.toString()}
                                  id={`option-${option.id}`}
                                  className="mt-0.5"
                                />
                                <Label
                                  htmlFor={`option-${option.id}`}
                                  className="flex-1 cursor-pointer text-sm leading-relaxed font-medium"
                                >
                                  {option.text}
                                </Label>
                                {showResults && isCorrect && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {showResults && isSelected && !isCorrect && (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Submit Button */}
          {!showResults && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleSubmitQuiz}
                disabled={!isQuizComplete}
                size="lg"
                className="px-8"
              >
                Submit Quiz
              </Button>
              {!isQuizComplete && (
                <p className="text-muted-foreground mt-2 text-sm">
                  Please answer all questions before submitting
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
