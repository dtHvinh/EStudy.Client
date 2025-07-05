"use client";

import TailwindEditor from "@/components/text-editor/text-editor";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type CourseLesson,
  useCreateCourseStructure,
} from "@/hooks/use-create-course-structure";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Paperclip,
  Play,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import FileDropzone from "../file-dropzone";
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

interface LessonTreeItemProps {
  lesson: CourseLesson;
  chapterIndex: number;
  lessonIndex: number;
  dragHandleProps?: any;
}

export function LessonTreeItem({
  lesson,
  chapterIndex,
  lessonIndex,
  dragHandleProps,
}: LessonTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const {
    updateLesson,
    deleteLesson,
    setAttachments,
    deleteAttachment,
    setVideo,
    deleteVideo,
  } = useCreateCourseStructure();

  const handleSetAttachments = (files: File[]) => {
    setAttachments(chapterIndex, lessonIndex, files);
  };

  const handleSetVideo = (file: File[]) => {
    setVideo(chapterIndex, lessonIndex, file[0]);
  };

  const handleDeleteAttachment = (file: File) => {
    deleteAttachment(chapterIndex, lessonIndex, file);
  };

  const handleDeleteVideo = () => {
    deleteVideo(chapterIndex, lessonIndex);
  };

  return (
    <div className="group ml-4">
      <div className="hover:bg-muted/20 flex items-start gap-2 rounded-md py-1 transition-colors">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground h-3 w-3" />
          </div>

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex-1"
          >
            <div className="flex flex-1 items-center gap-2">
              <CollapsibleTrigger className="hover:bg-muted/50 -ml-1 flex items-center gap-2 rounded-md p-1">
                {isOpen ? (
                  <ChevronDown className="text-muted-foreground h-3 w-3" />
                ) : (
                  <ChevronRight className="text-muted-foreground h-3 w-3" />
                )}
              </CollapsibleTrigger>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Play className="text-primary/70 h-3 w-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <Input
                      value={lesson.title}
                      onChange={(e) =>
                        updateLesson(chapterIndex, lessonIndex, {
                          title: e.target.value,
                        })
                      }
                      spellCheck="false"
                      onBlur={() => setIsEditing(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setIsEditing(false);
                      }}
                      className="h-7 text-xs"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="hover:text-primary w-full truncate rounded-md bg-gray-200 p-2 text-left text-xs transition-colors"
                    >
                      {lesson.title || `Lesson ${lessonIndex + 1}`}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {lesson.attachedFileUrls.length > 0 && (
                  <span className="text-muted-foreground bg-muted flex items-center gap-1 rounded px-1.5 py-0.5 text-xs">
                    <Paperclip className="h-2.5 w-2.5" />
                    {lesson.attachedFileUrls.length}
                  </span>
                )}

                <DeleteButton
                  onClick={() => deleteLesson(chapterIndex, lessonIndex)}
                />
              </div>
            </div>

            <CollapsibleContent>
              <div className="border-muted mt-2 ml-4 space-y-3 border-l pl-3">
                <div>
                  <Label
                    htmlFor={`lesson-description-${chapterIndex}-${lessonIndex}`}
                    className="text-xs"
                  >
                    Description
                  </Label>
                  <Textarea
                    spellCheck="false"
                    id={`lesson-description-${chapterIndex}-${lessonIndex}`}
                    value={lesson.description || ""}
                    onChange={(e) =>
                      updateLesson(chapterIndex, lessonIndex, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the lesson"
                    rows={2}
                    className="text-xs"
                  />
                </div>

                <div>
                  <Label
                    htmlFor={`lesson-content-${chapterIndex}-${lessonIndex}`}
                    className="text-xs"
                  >
                    Lesson Content
                  </Label>
                  <TailwindEditor
                    className="rounded-md border text-sm"
                    onContentUpdate={(_, e) =>
                      updateLesson(chapterIndex, lessonIndex, {
                        content: e,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Attached Files</Label>
                    <div className="space-y-2">
                      <FileDropzone
                        onFilesSelected={handleSetAttachments}
                        onFileRemoved={handleDeleteAttachment}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Video</Label>
                    <div className="space-y-2">
                      <FileDropzone
                        onFilesSelected={handleSetVideo}
                        onFileRemoved={handleDeleteVideo}
                        maxFiles={1}
                        accept={{ "video/*": [] }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
        >
          <Trash2 className="h-2.5 w-2.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this lesson. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
