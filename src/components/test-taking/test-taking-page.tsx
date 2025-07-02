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
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Send } from "lucide-react";
import { useState } from "react";

import useTestQuestionMark from "@/hooks/use-test-question-mark";
import {
  TestTakingType,
  UserAnswer,
  useTestTaking,
} from "@/hooks/use-test-taking";
import { useTestTimer } from "@/hooks/use-test-timer";
import { cn } from "@/lib/utils";
import NavigateBack from "../navigate-back";
import CountdownTimer from "./count-down-timer";
import { QuestionDisplay } from "./question-display";
import QuestionNavigation from "./question-nav";
import { SectionNavigation } from "./section-nav";

interface TestTakingPageProps {
  testData: TestTakingType;
  onSubmit: (answers: UserAnswer[], timeSpent: number) => void;
}

export function TestTakingPage({ testData, onSubmit }: TestTakingPageProps) {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  const { isQuestionMarked, markQuestion, unmarkQuestion } =
    useTestQuestionMark();

  const { timeRemaining, isTimeUp, formatTime, warningLevel } = useTestTimer({
    duration: testData.duration,
  });

  const {
    currentSectionIndex,
    currentQuestionIndex,
    userAnswers,
    sectionProgress,
    totalProgress,
    updateAnswer,
    navigateToSection,
    navigateToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    isQuestionAnswered,
  } = useTestTaking(testData);

  const currentSection = testData.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const currentQuestionNumber =
    testData.sections
      .slice(0, currentSectionIndex)
      .reduce((sum, section) => sum + section.questions.length, 0) +
    currentQuestionIndex +
    1;

  const handleSubmit = () => {
    const answers = Array.from(userAnswers.values());
    onSubmit(answers, testData.duration * 60 - timeRemaining);
    setShowSubmitDialog(false);
  };

  const handleTimeUpSubmit = () => {
    const answers = Array.from(userAnswers.values());
    onSubmit(answers, testData.duration * 60 - timeRemaining);
    setShowTimeUpDialog(false);
  };

  const canGoPrevious = currentSectionIndex > 0 || currentQuestionIndex > 0;
  const canGoNext =
    currentSectionIndex < testData.sections.length - 1 ||
    currentQuestionIndex < currentSection.questions.length - 1;

  const unansweredCount = testData.questionCount - userAnswers.size;

  // Show time up dialog when time expires
  if (isTimeUp && !showTimeUpDialog) {
    setShowTimeUpDialog(true);
  }

  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <NavigateBack />
              <h1 className="mb-2 text-2xl font-bold">{testData.title}</h1>
              <p className="text-muted-foreground mb-2">
                {testData.description}
              </p>
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span>
                  Section {currentSectionIndex + 1} of {testData.sectionCount}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>
                  Question {currentQuestionNumber} of {testData.questionCount}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>Passing Score: {testData.passingScore}%</span>
              </div>
            </div>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="flex items-center gap-2"
              disabled={isTimeUp}
              size="lg"
            >
              <Send className="h-4 w-4" />
              Submit Test
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <QuestionNavigation
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          goToPreviousQuestion={goToPreviousQuestion}
          goToNextQuestion={goToNextQuestion}
          currentSection={currentSection}
          currentQuestionIndex={currentQuestionIndex}
        />

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <CountdownTimer
              formatTime={formatTime}
              timeLeft={timeRemaining}
              warningLevel={warningLevel}
              isTimeUp={isTimeUp}
            />

            <SectionNavigation
              sections={testData.sections}
              sectionProgress={sectionProgress}
              currentSectionIndex={currentSectionIndex}
              currentQuestionIndex={currentQuestionIndex}
              onSectionSelect={navigateToSection}
              onQuestionSelect={navigateToQuestion}
              isQuestionAnswered={isQuestionAnswered}
              isQuestionMarked={isQuestionMarked}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {currentQuestion && (
                <QuestionDisplay
                  question={currentQuestion}
                  isQuestionMarked={isQuestionMarked}
                  questionNumber={currentQuestionNumber}
                  sectionTitle={currentSection.title}
                  userAnswer={userAnswers.get(currentQuestion.id)}
                  onAnswerChange={updateAnswer}
                  onMarkQuestion={markQuestion}
                  onUnmarkQuestion={unmarkQuestion}
                />
              )}
            </div>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Test</DialogTitle>
              <DialogDescription>
                Are you sure you want to submit your test? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-medium">
                      {testData.questionCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answered:</span>
                    <span className="font-medium text-green-600">
                      {userAnswers.size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unanswered:</span>
                    <span
                      className={cn(
                        "font-medium",
                        unansweredCount > 0
                          ? "text-orange-600"
                          : "text-green-600",
                      )}
                    >
                      {unansweredCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="font-medium">
                      {Math.round(totalProgress.percentage)}%
                    </span>
                  </div>
                </div>

                {unansweredCount > 0 && (
                  <div className="rounded-md border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950">
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        You have {unansweredCount} unanswered question
                        {unansweredCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
              >
                Continue Test
              </Button>
              <Button onClick={handleSubmit}>Submit Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Time Up Dialog */}
        <Dialog open={showTimeUpDialog} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Time's Up!
              </DialogTitle>
              <DialogDescription>
                The test time has expired. Your answers will be automatically
                submitted.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center">
              <p className="text-muted-foreground text-sm">
                You answered{" "}
                <span className="font-medium text-green-600">
                  {userAnswers.size}
                </span>{" "}
                out of{" "}
                <span className="font-medium">{testData.questionCount}</span>{" "}
                questions.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleTimeUpSubmit} className="w-full">
                Submit Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
