"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Section {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
}

interface TestPreviewProps {
  title: string;
  description: string;
  duration: number;
  sections: Section[];
  getTotalQuestions: () => number;
  getTotalPoints: () => number;
  getAverageTimePerQuestion: () => number;
  getSectionStats: (sectionId: string) => { questions: number; points: number };
}

export function TestPreview({
  title,
  description,
  duration,
  sections,
  getTotalQuestions,
  getTotalPoints,
  getAverageTimePerQuestion,
  getSectionStats,
}: TestPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Preview</CardTitle>
        <CardDescription>
          Preview how your test will appear to students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">{title || "Untitled Test"}</h2>
            <p className="text-muted-foreground">{description}</p>
            <div className="text-muted-foreground flex justify-center gap-4 text-sm">
              <span>{duration} minutes</span>
              <span>•</span>
              <span>{getTotalQuestions()} questions</span>
              <span>•</span>
              <span>{getTotalPoints()} points</span>
              <span>•</span>
              <span>{getAverageTimePerQuestion()}m per question</span>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            {sections.map((section, index) => {
              const sectionStats = getSectionStats(section.id);
              return (
                <div key={section.id} className="space-y-2">
                  <h3 className="font-semibold">
                    Section {index + 1}: {section.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {sectionStats.questions} question
                    {sectionStats.questions !== 1 ? "s" : ""} •{" "}
                    {sectionStats.points} point
                    {sectionStats.points !== 1 ? "s" : ""}
                    {section.timeLimit && ` • ${section.timeLimit} minutes`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
