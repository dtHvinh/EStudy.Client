"use client";

import { Button } from "@/components/ui/button";
import { useEditCourseStructure } from "@/hooks/use-edit-course-structure";
import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ChapterTreeItem } from "./chapter-tree-item";

export default function CourseStructure() {
  const { addChapter, chapters } = useEditCourseStructure(
    useShallow((state) => ({
      addChapter: state.addChapter,
      chapters: state.chapters,
    })),
  );
  const [expandedChapterIndex, setExpandedChapterIndex] = useState<
    number | null
  >(null);

  const handleChapterToggle = (chapterIndex: number) => {
    setExpandedChapterIndex(
      expandedChapterIndex === chapterIndex ? null : chapterIndex,
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="text-primary h-6 w-6" />
          <h2 className="text-2xl font-semibold">Course Structure</h2>
        </div>
      </div>

      <div className="space-y-1">
        {chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <BookOpen className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No chapters yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start building your course by adding your first chapter. Each
              chapter can contain multiple lessons.
            </p>
            <Button onClick={addChapter} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add First Chapter
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {chapters
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((_, index) => (
                  <ChapterTreeItem
                    key={index}
                    chapterIndex={index}
                    isExpanded={expandedChapterIndex === index}
                    onToggle={() => handleChapterToggle(index)}
                  />
                ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <Button
                variant="outline"
                onClick={addChapter}
                className="w-full bg-transparent sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Chapter
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
