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
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Circle,
  Copy,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { QuestionCard } from "./question-card";

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
  onAddQuestion: (sectionId: string, type?: Question["type"]) => void;
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
  const singleChoiceCount = section.questions.filter(
    (q) => q.type === "single-choice",
  ).length;
  const multipleChoiceCount = section.questions.filter(
    (q) => q.type === "multiple-choice",
  ).length;

  return (
    <Card className="overflow-hidden shadow-sm">
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
                  <CardDescription className="flex items-center gap-2">
                    <span>
                      {sectionStats.questions} question
                      {sectionStats.questions !== 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>
                      {sectionStats.points} point
                      {sectionStats.points !== 1 ? "s" : ""}
                    </span>
                    {singleChoiceCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Circle className="h-3 w-3 text-blue-500" />
                          {singleChoiceCount} Single
                        </span>
                      </>
                    )}
                    {multipleChoiceCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3 text-green-500" />
                          {multipleChoiceCount} Multiple
                        </span>
                      </>
                    )}
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

        <CollapsibleContent
          className={cn(
            "text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-none",
          )}
        >
          <CardContent className="space-y-4">
            {/* Section Settings */}
            <div className="bg-muted/30 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  spellCheck={false}
                  placeholder="e.g., Reading Comprehension, Math Problems"
                  value={section.title}
                  onChange={(e) =>
                    onUpdateSection(section.id, "title", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Section Description</Label>
                <Textarea
                  spellCheck={false}
                  placeholder="Describe this section and any special instructions for students"
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
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => onAddQuestion(section.id, "single-choice")}
                    >
                      <Circle className="mr-2 h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Single Choice</div>
                        <div className="text-muted-foreground text-xs">
                          One correct answer
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onAddQuestion(section.id, "multiple-choice")
                      }
                    >
                      <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Multiple Choice</div>
                        <div className="text-muted-foreground text-xs">
                          Multiple correct answers
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {section.questions.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground mb-4">
                      <p className="text-lg font-medium">
                        No questions in this section yet
                      </p>
                      <p className="text-sm">
                        Add your first question to get started
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          onAddQuestion(section.id, "single-choice")
                        }
                      >
                        <Circle className="mr-2 h-4 w-4 text-blue-500" />
                        Single Choice
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          onAddQuestion(section.id, "multiple-choice")
                        }
                      >
                        <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
                        Multiple Choice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
            <Button
              className="w-full"
              onClick={() => onAddQuestion(section.id)}
            >
              Add Question
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
