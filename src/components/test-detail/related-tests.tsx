"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedTest {
  id: string;
  title: string;
  questionCount: number;
  duration: number;
}

const relatedTests: RelatedTest[] = [
  {
    id: "1",
    title: "React Fundamentals",
    questionCount: 45,
    duration: 60,
  },
  {
    id: "2",
    title: "Node.js Basics",
    questionCount: 30,
    duration: 45,
  },
  {
    id: "3",
    title: "TypeScript Essentials",
    questionCount: 35,
    duration: 50,
  },
];

export function RelatedTests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {relatedTests.map((test) => (
          <div
            key={test.id}
            className="hover:bg-muted/50 cursor-pointer rounded-lg border p-3 transition-colors"
          >
            <h4 className="mb-1 text-sm font-medium">{test.title}</h4>
            <p className="text-muted-foreground text-xs">
              {test.questionCount} questions • {test.duration} min
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
