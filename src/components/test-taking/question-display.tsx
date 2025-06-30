"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TestTakingQuestion, UserAnswer } from "@/hooks/use-test-taking";
import { cn } from "@/lib/utils";
import { CheckSquare, Circle } from "lucide-react";
import { Button } from "../ui/button";

interface QuestionDisplayProps {
  question: TestTakingQuestion;
  questionNumber: number;
  sectionTitle: string;
  userAnswer?: UserAnswer;
  onAnswerChange: (questionId: number, selectedAnswerIds: number[]) => void;
  isQuestionMarked: (questionId: number) => boolean;
  onMarkQuestion: (questionId: number) => void;
  onUnmarkQuestion: (questionId: number) => void;
}

export function QuestionDisplay({
  question,
  questionNumber,
  sectionTitle,
  userAnswer,
  onAnswerChange,
  isQuestionMarked,
  onMarkQuestion,
  onUnmarkQuestion,
}: QuestionDisplayProps) {
  const selectedAnswerIds = userAnswer?.selectedAnswerIds || [];

  const handleSingleChoiceChange = (answerId: string) => {
    onAnswerChange(question.id, [parseInt(answerId)]);
  };

  const handleMultipleChoiceChange = (answerId: number, checked: boolean) => {
    let newSelectedIds: number[];

    if (checked) {
      newSelectedIds = [...selectedAnswerIds, answerId];
    } else {
      newSelectedIds = selectedAnswerIds.filter((id) => id !== answerId);
    }

    onAnswerChange(question.id, newSelectedIds);
  };

  const renderSingleChoice = () => (
    <RadioGroup
      value={selectedAnswerIds[0]?.toString() || ""}
      onValueChange={handleSingleChoiceChange}
      className="space-y-3"
    >
      {question.answers.map((answer) => (
        <div
          key={answer.id}
          className={cn(
            "hover:bg-muted/50 flex items-start space-x-3 rounded-lg border p-2 transition-colors",
            selectedAnswerIds.includes(answer.id) &&
              "border-primary bg-primary/5",
          )}
        >
          <RadioGroupItem
            value={answer.id.toString()}
            id={`answer-${answer.id}`}
            className="mt-0.5"
          />
          <Label
            htmlFor={`answer-${answer.id}`}
            className="flex-1 cursor-pointer text-sm leading-relaxed"
          >
            {answer.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.answers.map((answer) => (
        <div
          key={answer.id}
          className={cn(
            "hover:bg-muted/50 flex items-start space-x-3 rounded-lg border p-4 transition-colors",
            selectedAnswerIds.includes(answer.id) &&
              "border-primary bg-primary/5",
          )}
        >
          <Checkbox
            id={`answer-${answer.id}`}
            checked={selectedAnswerIds.includes(answer.id)}
            onCheckedChange={(checked) =>
              handleMultipleChoiceChange(answer.id, checked as boolean)
            }
            className="mt-0.5"
          />
          <Label
            htmlFor={`answer-${answer.id}`}
            className="flex-1 cursor-pointer text-sm leading-relaxed"
          >
            {answer.text}
          </Label>
        </div>
      ))}
    </div>
  );

  const isAnswered = selectedAnswerIds.length > 0;
  const isMarked = isQuestionMarked(question.id);

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isAnswered && "ring-blue/20 ring-1",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {sectionTitle}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Question {questionNumber}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {question.text}
            </CardTitle>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {question.points} {question.points === 1 ? "point" : "points"}
            </Badge>
            <Button
              variant={isMarked ? "default" : "outline"}
              size={"sm"}
              onClick={
                isMarked
                  ? () => onUnmarkQuestion(question.id)
                  : () => onMarkQuestion(question.id)
              }
            >
              {isMarked ? "Unmark this question" : "Mark this question"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {question.type === "multiple-choice" && (
          <div className="text-muted-foreground rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-950">
            <CheckSquare className="mr-2 inline h-4 w-4" />
            Select all correct answers. Multiple selections are allowed.
          </div>
        )}

        {question.type === "single-choice" && (
          <div className="text-muted-foreground rounded-md bg-green-50 p-3 text-sm dark:bg-green-950">
            <Circle className="mr-2 inline h-4 w-4" />
            Select one correct answer.
          </div>
        )}

        {question.type === "single-choice"
          ? renderSingleChoice()
          : renderMultipleChoice()}
      </CardContent>
    </Card>
  );
}
