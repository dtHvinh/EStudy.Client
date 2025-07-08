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
import { useStorage } from "@/hooks/use-storage";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Paperclip,
  Play,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
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
  const { deleteResource, uploadFile, removeFiles, getFilesUrl } = useStorage();
  const [isEditing, setIsEditing] = useState(false);
  const debounceUpdateLesson = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateLesson(chapterIndex, lessonIndex, {
        description: e.target.value,
      });
    },
    500,
  );
  const {
    courseId,
    updateLesson,
    deleteLesson,
    setAttachmentUrls,
    clearAttachments,
    setVideoUrl,
    deleteVideo,
  } = useCreateCourseStructure();

  const handleSetAttachments = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      if (lesson.attachedFileUrls.length > 0) {
        await removeFiles(lesson.attachedFileUrls);
      }

      const tasks = Array.from(files).map((file) => {
        return uploadFile(
          file,
          [`course_id_${courseId}`, file.name].filter(Boolean).join("/"),
        );
      });

      const urls = await Promise.all(tasks);
      setAttachmentUrls(chapterIndex, lessonIndex, urls);
    } catch (error) {
      console.error("Failed to handle attachments:", error);
    }
  };

  const handleSetVideo = async (files: File[]) => {
    if (files.length === 0) return;
    const path = await uploadFile(
      files[0],
      [`course_id_${courseId}`, files[0].name].filter(Boolean).join("/"),
    );
    setVideoUrl(chapterIndex, lessonIndex, path);
  };

  const handleDeleteAttachments = async () => {
    clearAttachments(chapterIndex, lessonIndex);
    await removeFiles(lesson.attachedFileUrls);
  };

  const handleDeleteVideo = async () => {
    deleteResource(lesson.videoUrl!);
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
            <div className="flex flex-1 items-end gap-2">
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
              <div>
                <Label
                  htmlFor={`lesson-em-${chapterIndex}-${lessonIndex}`}
                  className="text-xs"
                >
                  Duration minutes
                </Label>
                <Input
                  type="number"
                  spellCheck="false"
                  id={`lesson-em-${chapterIndex}-${lessonIndex}`}
                  value={lesson.durationMinutes || ""}
                  onChange={(e) =>
                    updateLesson(chapterIndex, lessonIndex, {
                      durationMinutes: parseInt(e.target.value),
                    })
                  }
                  className="h-7 w-28 text-xs"
                />
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
                    defaultValue={lesson.description || ""}
                    onChange={debounceUpdateLesson}
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
                    initialContent={lesson.content || ""}
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
                        onFilesRemoved={handleDeleteAttachments}
                        accept={{
                          "application/*": [],
                          "text/*": [],
                        }}
                        previews={getFilesUrl(lesson.attachedFileUrls)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Video</Label>
                    <div className="space-y-2">
                      <FileDropzone
                        onFilesSelected={handleSetVideo}
                        onFilesRemoved={handleDeleteVideo}
                        maxFiles={1}
                        accept={{ "video/*": [] }}
                        previews={
                          lesson.videoUrl ? getFilesUrl([lesson.videoUrl]) : []
                        }
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
