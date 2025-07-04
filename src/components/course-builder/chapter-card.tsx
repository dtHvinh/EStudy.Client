"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CourseChapter,
  useCreateCourseStructure,
} from "@/hooks/use-create-course-structure";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { LessonCard } from "./lesson-card";

interface ChapterCardProps {
  chapter: CourseChapter;
  chapterIndex: number;
  dragHandleProps?: any;
}

export function ChapterCard({
  chapter,
  chapterIndex,
  dragHandleProps,
}: ChapterCardProps) {
  const { updateChapter, addLesson, deleteChapter } =
    useCreateCourseStructure();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground h-5 w-5" />
          </div>

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex-1"
          >
            <CollapsibleTrigger className="hover:bg-muted/50 -ml-2 flex items-center gap-2 rounded-md p-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">
                {chapter.title || `Chapter ${chapterIndex + 1}`}
              </span>
              <span className="text-muted-foreground ml-auto text-sm">
                {chapter.lessons.length} lesson
                {chapter.lessons.length !== 1 ? "s" : ""}
              </span>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor={`chapter-title-${chapterIndex}`}>
                    Chapter Title
                  </Label>
                  <Input
                    spellCheck="false"
                    id={`chapter-title-${chapterIndex}`}
                    value={chapter.title}
                    onChange={(e) =>
                      updateChapter(chapterIndex, { title: e.target.value })
                    }
                    placeholder="Enter chapter title"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id={`chapter-published-${chapterIndex}`}
                    checked={chapter.isPublished}
                    onCheckedChange={(checked) =>
                      updateChapter(chapterIndex, { isPublished: checked })
                    }
                  />
                  <Label htmlFor={`chapter-published-${chapterIndex}`}>
                    Published
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor={`chapter-description-${chapterIndex}`}>
                  Description
                </Label>
                <Textarea
                  spellCheck="false"
                  id={`chapter-description-${chapterIndex}`}
                  value={chapter.description || ""}
                  onChange={(e) =>
                    updateChapter(chapterIndex, { description: e.target.value })
                  }
                  placeholder="Describe what students will learn in this chapter"
                  rows={2}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <DeleteButton onClick={() => deleteChapter(chapterIndex)} />
        </div>
      </CardHeader>

      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <LessonCard
                    key={lessonIndex}
                    lesson={lesson}
                    chapterIndex={chapterIndex}
                    lessonIndex={lessonIndex}
                  />
                ))}

                <Button
                  variant="outline"
                  onClick={() => addLesson(chapterIndex)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Delete this chapter and all its lessons
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete this chapter and all its lessons. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
