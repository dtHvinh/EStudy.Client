"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TestInformationProps {
  title: string;
  description: string;
  duration: number;
  onUpdateTitle: (title: string) => void;
  onUpdateDescription: (description: string) => void;
  onUpdateDuration: (duration: number) => void;
}

export function TestInformation({
  title,
  description,
  duration,
  onUpdateTitle,
  onUpdateDescription,
  onUpdateDuration,
}: TestInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Information</CardTitle>
        <CardDescription>Basic information about your test</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="test-title">Test Title</Label>
            <Input
              autoComplete="off"
              spellCheck={false}
              id="test-title"
              placeholder="Enter test title"
              value={title}
              onChange={(e) => onUpdateTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="test-duration">Duration (minutes)</Label>{" "}
            <Input
              spellCheck={false}
              id="test-duration"
              type="number"
              placeholder="60"
              value={duration || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  onUpdateDuration(0);
                } else {
                  const numValue = Number.parseInt(value);
                  onUpdateDuration(isNaN(numValue) ? 0 : numValue);
                }
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-description">Description</Label>
          <Textarea
            spellCheck={false}
            id="test-description"
            placeholder="Describe what this test covers"
            value={description}
            onChange={(e) => onUpdateDescription(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
