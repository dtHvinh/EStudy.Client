"use client";

import { Card } from "@/components/ui/card";
import { AnswerOptions } from "./answer-options";
import { QuestionExplanation } from "./question-explanation";
import { QuestionHeader } from "./question-header";
import { QuestionTextEditor } from "./question-text-editor";
import { AnswerUpdateHandler, Question, QuestionUpdateHandler } from "./types";
import { ValidationAlerts } from "./validation-alerts";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  sectionId: string;
  onUpdateQuestion: QuestionUpdateHandler;
  onDeleteQuestion: (sectionId: string, questionId: string) => void;
  onDuplicateQuestion: (sectionId: string, questionId: string) => void;
  onUpdateAnswer: AnswerUpdateHandler;
  onSetCorrectAnswer: (
    sectionId: string,
    questionId: string,
    answerId: string,
  ) => void;
  onAddAnswerOption: (sectionId: string, questionId: string) => void;
  onRemoveAnswerOption: (
    sectionId: string,
    questionId: string,
    answerId: string,
  ) => void;
}

export function QuestionCard({
  question,
  questionIndex,
  sectionId,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onUpdateAnswer,
  onSetCorrectAnswer,
  onAddAnswerOption,
  onRemoveAnswerOption,
}: QuestionCardProps) {
  const correctAnswersCount = question.answers.filter(
    (a) => a.isCorrect,
  ).length;

  return (
    <Card
      className={`border-l-4 ${question.type === "single-choice" ? "border-l-blue-500" : "border-l-green-500"} transition-all duration-200 hover:shadow-md`}
    >
      <div className="p-6">
        <QuestionHeader
          questionIndex={questionIndex}
          questionType={question.type}
          points={question.points}
          sectionId={sectionId}
          questionId={question.id}
          onUpdateQuestion={onUpdateQuestion}
          onDeleteQuestion={onDeleteQuestion}
          onDuplicateQuestion={onDuplicateQuestion}
        />

        <ValidationAlerts
          questionType={question.type}
          correctAnswersCount={correctAnswersCount}
        />

        <div className="space-y-4">
          <QuestionTextEditor
            question={question}
            sectionId={sectionId}
            questionId={question.id}
            onUpdateQuestion={onUpdateQuestion}
          />

          <AnswerOptions
            questionType={question.type}
            answers={question.answers}
            sectionId={sectionId}
            questionId={question.id}
            onUpdateAnswer={onUpdateAnswer}
            onSetCorrectAnswer={onSetCorrectAnswer}
            onAddAnswerOption={onAddAnswerOption}
            onRemoveAnswerOption={onRemoveAnswerOption}
          />

          <QuestionExplanation
            explanation={question.explanation}
            sectionId={sectionId}
            questionId={question.id}
            onUpdateQuestion={onUpdateQuestion}
          />
        </div>
      </div>
    </Card>
  );
}
