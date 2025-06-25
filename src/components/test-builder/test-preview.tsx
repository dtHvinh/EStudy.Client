import { Test } from "@/hooks/use-create-test";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function TestPreview({
  test,
  getTotalQuestions,
  getTotalPoints,
  getSectionStats,
}: {
  test: Test;
  getTotalQuestions: () => number;
  getTotalPoints: () => number;
  getSectionStats: (sectionId: string) => { questions: number; points: number };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Test Preview</CardTitle>
        <CardDescription>How your test will appear to students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="font-bold">{test.title || "Untitled Test"}</h3>
            <p className="text-muted-foreground text-sm">{test.description}</p>
            <div className="text-muted-foreground flex justify-center gap-2 text-xs">
              <span>{test.duration}m</span>
              <span>•</span>
              <span>{getTotalQuestions()} questions</span>
              <span>•</span>
              <span>{getTotalPoints()} points</span>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            {test.sections.map((section, index) => {
              const stats = getSectionStats(section.id);
              return (
                <div key={section.id} className="text-sm">
                  <p className="font-medium">
                    Section {index + 1}: {section.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {stats.questions} questions • {stats.points} points
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
