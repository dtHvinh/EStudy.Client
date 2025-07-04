"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateCourse } from "@/hooks/use-create-course";
import { BookOpen, Eye, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { ChapterCard } from "./chapter-card";
import { CourseHeader } from "./course-header";

export function CourseBuilder() {
  const { course, addChapter, isDirty, markClean, isLoading } =
    useCreateCourse();

  const handleSave = async () => {
    try {
      console.log("Saving course:", course);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      markClean();
      toast.success("Course saved successfully!");
    } catch (error) {
      toast.error("Failed to save course");
      console.error("Save error:", error);
    }
  };

  const handlePreview = () => {
    toast.info("Preview functionality would open course preview");
  };

  const totalLessons = course.chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0,
  );
  const totalDuration = course.chapters.reduce(
    (total, chapter) =>
      total +
      chapter.lessons.reduce(
        (chapterTotal, lesson) => chapterTotal + lesson.durationMinutes,
        0,
      ),
    0,
  );

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your course content
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Course"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <CourseHeader />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Structure
              </CardTitle>
              <div className="text-muted-foreground text-sm">
                {course.chapters.length} chapter
                {course.chapters.length !== 1 ? "s" : ""} • {totalLessons}{" "}
                lesson
                {totalLessons !== 1 ? "s" : ""} •{" "}
                {Math.round(totalDuration / 60)}h {totalDuration % 60}m
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.chapters.length === 0 ? (
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
                  {course.chapters.map((chapter, index) => (
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
      </div>
    </div>
  );
}
