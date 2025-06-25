import { CheckSquare, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const TestGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Question Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Circle className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-blue-900">Single Choice</span>
          </div>
          <p className="text-xs text-blue-700">
            Students select exactly one correct answer from multiple options.
            Perfect for factual questions with one definitive answer.
          </p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-green-500" />
            <span className="font-medium text-green-900">Multiple Choice</span>
          </div>
          <p className="text-xs text-green-700">
            Students can select multiple correct answers. Ideal for questions
            where several options may be correct.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestGuide;
