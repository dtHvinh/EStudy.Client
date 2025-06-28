"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface Section {
  id: string | number;
  title: string;
  description?: string;
}

interface TestSectionsProps {
  sections: Section[];
  sectionCount: number;
}

export function TestSections({ sections, sectionCount }: TestSectionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Test Sections ({sectionCount})
        </CardTitle>
        <CardDescription>
          This test is organized into {sectionCount} main sections covering
          different topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="hover:bg-muted/50 flex gap-4 rounded-lg border p-4 transition-colors"
            >
              <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold">{section.title}</h3>
                {section.description && (
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
