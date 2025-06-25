"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Copy, MoreHorizontal, Plus, Trash2 } from "lucide-react";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: string;
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
    field: keyof { id: string; text: string; isCorrect: boolean },
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
  return (
    <Card className="border-l-primary border-l-4">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Q{questionIndex + 1}</Badge>
            <Select
              value={question.type}
              onValueChange={(value) =>
                onUpdateQuestion(sectionId, question.id, "type", value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-choice" defaultChecked>
                  Single Choice
                </SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Points:</Label>
              <Input
                type="number"
                className="h-8 w-16"
                clearable={false}
                value={question.points}
                onChange={(e) =>
                  onUpdateQuestion(
                    sectionId,
                    question.id,
                    "points",
                    Number.parseInt(e.target.value) || 1,
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
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteQuestion(sectionId, question.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              spellCheck={false}
              placeholder="Enter your question here"
              value={question.text}
              onChange={(e) =>
                onUpdateQuestion(sectionId, question.id, "text", e.target.value)
              }
            />
          </div>

          {question.type !== "short-answer" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                {question.answers.length < 6 && (
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
              <RadioGroup
                value={question.answers.find((a) => a.isCorrect)?.id}
                onValueChange={(value) =>
                  onSetCorrectAnswer(sectionId, question.id, value)
                }
              >
                {question.answers.map((answer, answerIndex) => (
                  <div key={answer.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={answer.id} />
                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${answerIndex + 1}`}
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
                      />
                    </div>
                    <Badge variant={answer.isCorrect ? "default" : "secondary"}>
                      {answer.isCorrect
                        ? "Correct"
                        : `Option ${answerIndex + 1}`}
                    </Badge>
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
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>Explanation (Optional)</Label>
            <Textarea
              spellCheck={false}
              placeholder="Explain the correct answer"
              value={question.explanation || ""}
              onChange={(e) =>
                onUpdateQuestion(
                  sectionId,
                  question.id,
                  "explanation",
                  e.target.value,
                )
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
