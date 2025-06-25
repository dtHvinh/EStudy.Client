"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckSquare,
  Circle,
  Copy,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: "single-choice" | "multiple-choice";
  text: string;
  points: number;
  answers: Answer[];
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  sectionId: string;
  onUpdateQuestion: (
    sectionId: string,
    questionId: string,
    field: keyof Question,
    value: any,
  ) => void;
  onDeleteQuestion: (sectionId: string, questionId: string) => void;
  onDuplicateQuestion: (sectionId: string, questionId: string) => void;
  onUpdateAnswer: (
    sectionId: string,
    questionId: string,
    answerId: string,
    field: keyof Answer,
    value: string,
  ) => void;
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
  const hasValidation =
    question.type === "single-choice" && correctAnswersCount !== 1;
  const multipleChoiceHasCorrect =
    question.type === "multiple-choice" && correctAnswersCount > 0;

  return (
    <Card
      className={`border-l-4 ${question.type === "single-choice" ? "border-l-blue-500" : "border-l-green-500"} transition-all duration-200 hover:shadow-md`}
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              {question.type === "single-choice" ? (
                <Circle className="h-4 w-4 text-blue-500" />
              ) : (
                <CheckSquare className="h-4 w-4 text-green-500" />
              )}
              Q{questionIndex + 1}
            </Badge>
            <Select
              value={question.type}
              onValueChange={(value) =>
                onUpdateQuestion(sectionId, question.id, "type", value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-choice">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-blue-500" />
                    Single Choice
                  </div>
                </SelectItem>
                <SelectItem value="multiple-choice">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-green-500" />
                    Multiple Choice
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant={
                question.type === "single-choice" ? "default" : "secondary"
              }
              className={cn(
                "text-white",
                question.type === "single-choice"
                  ? "bg-blue-500"
                  : "bg-green-500",
              )}
            >
              {question.type === "single-choice"
                ? "Single Choice"
                : "Multiple Choice"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Points:</Label>
              <Input
                clearable={false}
                type="number"
                className="h-8 w-16"
                value={question.points}
                min="1"
                onChange={(e) =>
                  onUpdateQuestion(
                    sectionId,
                    question.id,
                    "points",
                    Math.max(1, Number.parseInt(e.target.value) || 1),
                  )
                }
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onDuplicateQuestion(sectionId, question.id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate Question
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteQuestion(sectionId, question.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Question
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Validation Alert */}
        {hasValidation && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Single choice questions must have exactly one correct answer.
              Currently {correctAnswersCount} answers are marked as correct.
            </AlertDescription>
          </Alert>
        )}

        {question.type === "multiple-choice" && !multipleChoiceHasCorrect && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Multiple choice questions must have at least one correct answer.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Question Text</Label>
            <Textarea
              spellCheck="false"
              placeholder="Enter your question here..."
              value={question.text}
              onChange={(e) =>
                onUpdateQuestion(sectionId, question.id, "text", e.target.value)
              }
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Answer Options</Label>
              <div className="flex items-center gap-2">
                {question.type === "single-choice" && (
                  <Badge variant="outline" className="text-xs">
                    Select one correct answer
                  </Badge>
                )}
                {question.type === "multiple-choice" && (
                  <Badge variant="outline" className="text-xs">
                    Select multiple correct answers
                  </Badge>
                )}
                {question.answers.length < 8 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddAnswerOption(sectionId, question.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                )}
              </div>
            </div>

            {question.type === "single-choice" ? (
              <RadioGroup
                value={question.answers.find((a) => a.isCorrect)?.id || ""}
                onValueChange={(value) =>
                  onSetCorrectAnswer(sectionId, question.id, value)
                }
                className="space-y-3"
              >
                {question.answers.map((answer, answerIndex) => (
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
                            question.id,
                            answer.id,
                            "text",
                            e.target.value,
                          )
                        }
                        className="focus:border-input border-0 bg-transparent focus:border focus:bg-white"
                      />
                    </div>
                    {question.answers.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onRemoveAnswerOption(
                            sectionId,
                            question.id,
                            answer.id,
                          )
                        }
                        tabIndex={-1}
                        className="hover:text-destructive hover:bg-destructive/10 text-gray-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        ee
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {question.answers.map((answer, answerIndex) => (
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
                        onSetCorrectAnswer(sectionId, question.id, answer.id)
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
                            question.id,
                            answer.id,
                            "text",
                            e.target.value,
                          )
                        }
                        className="focus:border-input border-0 bg-transparent focus:border focus:bg-white"
                      />
                    </div>
                    {question.answers.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onRemoveAnswerOption(
                            sectionId,
                            question.id,
                            answer.id,
                          )
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Explanation (Optional)
            </Label>
            <Textarea
              spellCheck="false"
              placeholder="Explain why the correct answer(s) are correct. This will be shown to students after submission."
              value={question.explanation || ""}
              onChange={(e) =>
                onUpdateQuestion(
                  sectionId,
                  question.id,
                  "explanation",
                  e.target.value,
                )
              }
              className="resize-none"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
