"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionProgress, TestTakingSection } from "@/hooks/use-test-taking";
import { cn } from "@/lib/utils";

import { BookOpen } from "lucide-react";

interface SectionNavigationProps {
  sections: TestTakingSection[];
  sectionProgress: SectionProgress[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  onSectionSelect: (sectionIndex: number) => void;
  onQuestionSelect: (sectionIndex: number, questionIndex: number) => void;
  isQuestionAnswered: (questionIndex: number) => boolean;
  isQuestionMarked: (questionId: number) => boolean;
}

export function SectionNavigation({
  sections,
  sectionProgress,
  currentSectionIndex,
  currentQuestionIndex,
  onSectionSelect,
  onQuestionSelect,
  isQuestionAnswered,
  isQuestionMarked,
}: SectionNavigationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5" />
          Test Sections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section, sectionIndex) => {
          const progress = sectionProgress.find(
            (p) => p.sectionId === section.id,
          );
          const isCurrent = sectionIndex === currentSectionIndex;

          return (
            <div key={section.id} className="space-y-2">
              <Button
                variant={"outline"}
                className={cn(
                  "h-auto w-full justify-start p-3 text-left",
                  progress?.isCompleted &&
                    !isCurrent &&
                    "border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-950",
                )}
                onClick={() => onSectionSelect(sectionIndex)}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                      {sectionIndex + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-wrap">
                        {section.title}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {progress?.answeredQuestions || 0} of{" "}
                        {progress?.totalQuestions || 0} answered
                      </div>
                    </div>
                  </div>
                </div>
              </Button>

              <div className="grid grid-cols-5 gap-1">
                {section.questions.length > 0 &&
                  section.questions.map((question, qIndex) => {
                    const questionNumber =
                      sections
                        .slice(0, sectionIndex)
                        .reduce((sum, s) => sum + s.questions.length, 0) +
                      qIndex +
                      1;

                    return (
                      <Button
                        key={question.id}
                        onClick={() => {
                          onQuestionSelect(sectionIndex, qIndex);
                        }}
                        variant={"outline"}
                        className={cn(
                          "h-8 w-8 p-0 text-xs",
                          isCurrent &&
                            qIndex === currentQuestionIndex &&
                            "ring-primary ring-2",
                          isQuestionMarked(question.id) &&
                            "bg-yellow-200 text-black hover:bg-amber-100",
                          isQuestionAnswered(question.id) &&
                            "border-0 bg-green-200 text-black hover:bg-green-100",
                        )}
                      >
                        {questionNumber}
                      </Button>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
