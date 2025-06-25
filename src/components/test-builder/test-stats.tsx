import { Test } from "@/hooks/use-create-test";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { CheckSquare, Circle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const TestStatistic = ({
  test,
  getTotalQuestions,
  getTotalPoints,
  getAverageTimePerQuestion,
  singleChoiceCount = 0,
  multipleChoiceCount = 0,
}: {
  test: Test;
  getTotalQuestions: () => number;
  getTotalPoints: () => number;
  getAverageTimePerQuestion: () => number;
  singleChoiceCount?: number;
  multipleChoiceCount: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Test Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{test.sections.length}</div>
            <p className="text-muted-foreground text-xs">Sections</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{getTotalQuestions()}</div>
            <p className="text-muted-foreground text-xs">Questions</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{getTotalPoints()}</div>
            <p className="text-muted-foreground text-xs">Total Points</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {getAverageTimePerQuestion()}m
            </div>
            <p className="text-muted-foreground text-xs">Avg/Question</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Single Choice</span>
            </div>
            <Badge variant="outline">{singleChoiceCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-green-500" />
              <span className="text-sm">Multiple Choice</span>
            </div>
            <Badge variant="outline">{multipleChoiceCount}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestStatistic;
