"use client";

import { useCreateCourseStructure } from "@/hooks/use-create-course-structure";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChapterCard } from "./chapter-card";

export default function CourseStructure() {
  const { addChapter, getTotalDuration, getTotalLessons, chapters } =
    useCreateCourseStructure();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Structure
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            {chapters.length} chapter
            {chapters.length !== 1 ? "s" : ""} • {getTotalLessons()} lesson
            {getTotalLessons() !== 1 ? "s" : ""} •{" "}
            {Math.round(getTotalDuration() / 60)}h {getTotalDuration() % 60}m
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chapters.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="mb-2 text-lg">No chapters yet</p>
              <p className="mb-4 text-sm">
                Start building your course by adding your first chapter
              </p>
              <Button onClick={addChapter}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Chapter
              </Button>
            </div>
          ) : (
            <>
              {chapters.map((chapter, index) => (
                <ChapterCard
                  key={index}
                  chapter={chapter}
                  chapterIndex={index}
                />
              ))}

              <Button
                variant="outline"
                onClick={addChapter}
                className="w-full bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Chapter
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
