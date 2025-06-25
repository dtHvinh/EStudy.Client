"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/hooks/use-create-test";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { QuestionCard } from "./question-card";

interface Question {
  id: string;
  type: string;
  text: string;
  points: number;
  answers: any[];
  explanation?: string;
}

interface SectionStats {
  questions: number;
  points: number;
}

interface TestSectionProps {
  section: Section;
  sectionIndex: number;
  sectionStats: SectionStats;
  onUpdateSection: (
    sectionId: string,
    field: keyof Section,
    value: any,
  ) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onToggleSection: (sectionId: string) => void;
  onAddQuestion: (
    sectionId: string,
    type?: "single-choice" | "true-false" | "short-answer",
  ) => void;
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

export function TestSection({
  section,
  sectionIndex,
  sectionStats,
  onUpdateSection,
  onDeleteSection,
  onDuplicateSection,
  onToggleSection,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onUpdateAnswer,
  onSetCorrectAnswer,
  onAddAnswerOption,
  onRemoveAnswerOption,
}: TestSectionProps) {
  return (
    <Card className="overflow-hidden">
      <Collapsible
        open={section.isExpanded}
        onOpenChange={() => onToggleSection(section.id)}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="text-muted-foreground h-4 w-4" />
                {section.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <div>
                  <CardTitle className="text-base">
                    {section.title || `Section ${sectionIndex + 1}`}
                  </CardTitle>
                  <CardDescription>
                    {sectionStats.questions} question
                    {sectionStats.questions !== 1 ? "s" : ""} •{" "}
                    {sectionStats.points} point
                    {sectionStats.points !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {sectionStats.questions} questions
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => onDuplicateSection(section.id)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate Section
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteSection(section.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Section
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Section Settings */}
            <div className="bg-muted/30 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  placeholder="e.g., Listening, Reading, Writing"
                  value={section.title}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(e) =>
                    onUpdateSection(section.id, "title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Time Limit (optional)</Label>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={section.timeLimit || ""}
                  onChange={(e) =>
                    onUpdateSection(
                      section.id,
                      "timeLimit",
                      Number.parseInt(e.target.value) || undefined,
                    )
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Section Description</Label>
                <Textarea
                  spellCheck={false}
                  placeholder="Describe this section"
                  value={section.description}
                  onChange={(e) =>
                    onUpdateSection(section.id, "description", e.target.value)
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Questions</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => onAddQuestion(section.id, "single-choice")}
                    >
                      Single Choice
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onAddQuestion(section.id, "true-false")}
                    >
                      True/False
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onAddQuestion(section.id, "short-answer")}
                    >
                      Short Answer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {section.questions.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <p className="mb-4">No questions in this section yet</p>
                  <Button
                    variant="outline"
                    onClick={() => onAddQuestion(section.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {section.questions.map((question, questionIndex) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      questionIndex={questionIndex}
                      sectionId={section.id}
                      onUpdateQuestion={onUpdateQuestion}
                      onDeleteQuestion={onDeleteQuestion}
                      onDuplicateQuestion={onDuplicateQuestion}
                      onUpdateAnswer={onUpdateAnswer}
                      onSetCorrectAnswer={onSetCorrectAnswer}
                      onAddAnswerOption={onAddAnswerOption}
                      onRemoveAnswerOption={onRemoveAnswerOption}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
