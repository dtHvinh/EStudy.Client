"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prerequisites = [
  "Basic JavaScript knowledge",
  "Understanding of web development",
  "Familiarity with ES6+ syntax",
];

export function TestPrerequisites() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prerequisites</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {prerequisites.map((prerequisite, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              {prerequisite}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
