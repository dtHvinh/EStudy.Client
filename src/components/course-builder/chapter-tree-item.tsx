"use client";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEditCourseStructure } from "@/hooks/use-edit-course-structure";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import ChapterTitle from "./chapter-tree-item-title";
import { LessonTreeItem } from "./lession-tree-item";

interface ChapterTreeItemProps {
  chapterIndex: number;
  dragHandleProps?: any;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function ChapterTreeItem({
  chapterIndex,
  dragHandleProps,
  isExpanded = false,
  onToggle,
}: ChapterTreeItemProps) {
  const {
    updateChapter,
    addLesson,
    deleteChapter,
    getChapterLessonLength,
    getChapterDescription,
    getChapterIsPublished,
    getChapterLessons,
  } = useEditCourseStructure(
    useShallow((state) => ({
      updateChapter: state.updateChapter,
      addLesson: state.addLesson,
      deleteChapter: state.deleteChapter,
      getChapterLessonLength: state.getChapterLessonLength,
      getChapterDescription: state.getChapterDescription,
      getChapterIsPublished: state.getChapterIsPublished,
      getChapterLessons: state.getChapterLessons,
    })),
  );
  const d = useDebouncedCallback((e) => {
    updateChapter(chapterIndex, {
      description: e.target.value,
    });
  }, 500);

  return (
    <div className="group">
      {/* Chapter Header */}
      <div className="hover:bg-muted/30 flex items-start gap-2 rounded-lg py-2 transition-colors">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground h-4 w-4" />
          </div>

          <Collapsible
            open={isExpanded}
            onOpenChange={onToggle}
            className="flex-1"
          >
            <div className="flex flex-1 items-center gap-2">
              <CollapsibleTrigger className="hover:bg-muted/50 -ml-1 flex items-center gap-2 rounded-md p-1">
                {isExpanded ? (
                  <ChevronDown className="text-muted-foreground h-4 w-4" />
                ) : (
                  <ChevronRight className="text-muted-foreground h-4 w-4" />
                )}
              </CollapsibleTrigger>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <BookOpen className="text-primary h-4 w-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <ChapterTitle chapterIndex={chapterIndex} />
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs">
                  {getChapterLessonLength(chapterIndex)} lesson
                  {getChapterLessonLength(chapterIndex) !== 1 ? "s" : ""}
                </span>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this chapter and all its
                        lessons. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteChapter(chapterIndex)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <CollapsibleContent>
              {/* Chapter Details */}
              <div className="border-muted mt-3 ml-6 space-y-4 border-l-2 pl-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <Label
                      htmlFor={`chapter-description-${chapterIndex}`}
                      className="text-xs"
                    >
                      Description
                    </Label>
                    <Textarea
                      spellCheck="false"
                      id={`chapter-description-${chapterIndex}`}
                      defaultValue={getChapterDescription(chapterIndex)}
                      onChange={d}
                      placeholder="Describe what students will learn in this chapter"
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`chapter-published-${chapterIndex}`}
                      checked={getChapterIsPublished(chapterIndex)}
                      onCheckedChange={(checked) =>
                        updateChapter(chapterIndex, { isPublished: checked })
                      }
                    />
                    <Label
                      htmlFor={`chapter-published-${chapterIndex}`}
                      className="text-xs"
                    >
                      Published
                    </Label>
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-1">
                  {getChapterLessons(chapterIndex).map(
                    (lesson, lessonIndex) => (
                      <LessonTreeItem
                        key={lessonIndex}
                        lesson={lesson}
                        chapterIndex={chapterIndex}
                        lessonIndex={lessonIndex}
                      />
                    ),
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => addLesson(chapterIndex)}
                    className="text-muted-foreground hover:text-foreground h-8 w-full justify-start text-xs"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Lesson
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
