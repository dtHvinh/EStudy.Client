"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { Answer, AnswerUpdateHandler } from "./types";

interface AnswerOptionsProps {
  questionType: "single-choice" | "multiple-choice";
  answers: Answer[];
  sectionId: string;
  questionId: string;
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

export function AnswerOptions({
  questionType,
  answers,
  sectionId,
  questionId,
  onUpdateAnswer,
  onSetCorrectAnswer,
  onAddAnswerOption,
  onRemoveAnswerOption,
}: AnswerOptionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Answer Options</Label>
        <div className="flex items-center gap-2">
          {questionType === "single-choice" && (
            <Badge variant="outline" className="text-xs">
              Select one correct answer
            </Badge>
          )}
          {questionType === "multiple-choice" && (
            <Badge variant="outline" className="text-xs">
              Select multiple correct answers
            </Badge>
          )}
          {answers.length < 8 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddAnswerOption(sectionId, questionId)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          )}
        </div>
      </div>

      {/* Render answers */}
      {questionType === "single-choice" ? (
        <RadioGroup
          value={answers.find((a) => a.isCorrect)?.id || ""}
          onValueChange={(value) =>
            onSetCorrectAnswer(sectionId, questionId, value)
          }
          className="space-y-3"
        >
          {answers.map((answer, answerIndex) => (
            <div
              key={answer.id}
              className={cn(
                `flex items-center space-x-3 rounded-lg transition-colors`,
                answer.isCorrect && "border-card-foreground",
              )}
            >
              <RadioGroupItem
                value={answer.id}
                className="text-blue-500"
                tabIndex={-1}
              />
              <div
                className={cn(
                  "flex-1 rounded-full border",
                  answer.isCorrect && "border-blue-400 bg-blue-50",
                )}
              >
                <Input
                  placeholder={`Option ${String.fromCharCode(65 + answerIndex)}`}
                  value={answer.text}
                  onChange={(e) =>
                    onUpdateAnswer(
                      sectionId,
                      questionId,
                      answer.id,
                      "text",
                      e.target.value,
                    )
                  }
                  className="focus:border-input border-0 bg-transparent focus:border focus:bg-white"
                />
              </div>
              {answers.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onRemoveAnswerOption(sectionId, questionId, answer.id)
                  }
                  tabIndex={-1}
                  className="hover:text-destructive hover:bg-destructive/10 text-gray-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="space-y-3">
          {answers.map((answer, answerIndex) => (
            <div
              key={answer.id}
              className={cn(
                `flex items-center space-x-3 rounded-lg transition-colors`,
                answer.isCorrect && "border-card-foreground",
              )}
            >
              <Checkbox
                checked={answer.isCorrect}
                onCheckedChange={() =>
                  onSetCorrectAnswer(sectionId, questionId, answer.id)
                }
                tabIndex={-1}
                className="data-[state=checked]:border-card data-[state=checked]:bg-card-foreground"
              />
              <div
                className={cn(
                  "flex-1 rounded-full border",
                  answer.isCorrect && "border-green-400 bg-green-50",
                )}
              >
                <Input
                  placeholder={`Option ${String.fromCharCode(65 + answerIndex)}`}
                  value={answer.text}
                  onChange={(e) =>
                    onUpdateAnswer(
                      sectionId,
                      questionId,
                      answer.id,
                      "text",
                      e.target.value,
                    )
                  }
                  className="focus:border-input border-0 bg-transparent focus:border focus:bg-white"
                />
              </div>
              {answers.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onRemoveAnswerOption(sectionId, questionId, answer.id)
                  }
                  tabIndex={-1}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
