"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Question, Section } from "@/hooks/use-create-test";
import { Plus } from "lucide-react";
import { TestSection } from "./test-section";

interface TestSectionsProps {
  sections: Section[];
  onResetTest: () => void;
  onAddSection: () => void;
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
    type?: "multiple-choice" | "single-choice" | "true-false" | "short-answer",
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
  getSectionStats: (sectionId: string) => { questions: number; points: number };
}

export function TestSections({
  sections,
  onResetTest,
  onAddSection,
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
  getSectionStats,
}: TestSectionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Test Sections</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onResetTest}>
            Reset All
          </Button>
          <Button onClick={onAddSection}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      </div>

      {sections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground mb-4">
              No sections created yet
            </div>
            <Button onClick={onAddSection}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => {
            const sectionStats = getSectionStats(section.id);

            return (
              <TestSection
                key={section.id}
                section={section}
                sectionIndex={sectionIndex}
                sectionStats={sectionStats}
                onUpdateSection={onUpdateSection}
                onDeleteSection={onDeleteSection}
                onDuplicateSection={onDuplicateSection}
                onToggleSection={onToggleSection}
                onAddQuestion={onAddQuestion}
                onUpdateQuestion={onUpdateQuestion}
                onDeleteQuestion={onDeleteQuestion}
                onDuplicateQuestion={onDuplicateQuestion}
                onUpdateAnswer={onUpdateAnswer}
                onSetCorrectAnswer={onSetCorrectAnswer}
                onAddAnswerOption={onAddAnswerOption}
                onRemoveAnswerOption={onRemoveAnswerOption}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
