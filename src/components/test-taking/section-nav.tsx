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
  onSectionSelect: (sectionIndex: number) => void;
  onQuestionSelect: (questionIndex: number) => void;
  isQuestionAnswered: (questionIndex: number) => boolean;
}

export function SectionNavigation({
  sections,
  sectionProgress,
  currentSectionIndex,
  onSectionSelect,
  onQuestionSelect,
  isQuestionAnswered,
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
        {sections.map((section, index) => {
          const progress = sectionProgress.find(
            (p) => p.sectionId === section.id,
          );
          const isCurrent = index === currentSectionIndex;

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
                onClick={() => onSectionSelect(index)}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                      {index + 1}
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

              <div className="grid grid-cols-5 gap-5">
                {section.questions.length > 0 &&
                  section.questions.map((_, qIndex) => {
                    return (
                      <Button
                        key={qIndex}
                        onClick={() => onQuestionSelect(qIndex)}
                        variant={
                          isQuestionAnswered(qIndex + 1) ? "default" : "outline"
                        }
                      >
                        {qIndex + 1}
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
