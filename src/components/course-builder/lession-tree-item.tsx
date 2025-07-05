"use client";

import type React from "react";

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
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { getFilePath } = useStorage();
  const { updateLesson, deleteLesson, addFile, addFiles, deleteFile } =
    useCreateCourseStructure();

  const handleDeleteVideo = async () => {
    if (!lesson.videoUrl) return;
    deleteFile(lesson.videoUrl);
    updateLesson(chapterIndex, lessonIndex, {
      videoUrl: "",
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = Array.from(files).map((file) => {
        const fileName = `${Date.now()}-${file.name}`;
        addFile(getFilePath(fileName), file);
        return getFilePath(fileName);
      });

      const existingUrls = lesson.attachedFileUrls
        ? lesson.attachedFileUrls.filter((url) => url.trim())
        : [];
      const allUrls = [...existingUrls, ...uploadedUrls];

      updateLesson(chapterIndex, lessonIndex, {
        attachedFileUrls: allUrls,
      });

      toast.success(`${uploadedUrls.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload files");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.warn("No file selected for video upload");
      return;
    }

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file");
      return;
    }

    try {
      const fileName = `${Date.now()}-${file.name}`;
      addFile(getFilePath(fileName), file);
      updateLesson(chapterIndex, lessonIndex, {
        videoUrl: getFilePath(fileName),
      });
      toast.success("Video uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload Video");
      console.error("Upload error:", error);
    } finally {
    }
  };

  const removeAttachedFile = async (urlToRemove: string) => {
    deleteFile(urlToRemove);
    updateLesson(chapterIndex, lessonIndex, {
      attachedFileUrls: lesson.attachedFileUrls?.filter(
        (url) => url !== urlToRemove,
      ),
    });
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
                      className="hover:text-primary w-full truncate text-left text-xs transition-colors"
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById(
                              `file-upload-${chapterIndex}-${lessonIndex}`,
                            )
                            ?.click()
                        }
                        disabled={uploading}
                        className="h-7 w-full text-xs"
                      >
                        <Upload className="mr-1 h-3 w-3" />
                        {uploading ? "Uploading..." : "Upload Files"}
                      </Button>

                      {lesson.attachedFileUrls.length > 0 && (
                        <div className="space-y-1">
                          {lesson.attachedFileUrls.map((fileUrl, index) => (
                            <div
                              key={index}
                              className="bg-muted flex items-center gap-2 rounded-md p-1.5 text-xs"
                            >
                              <Paperclip className="h-2.5 w-2.5" />
                              <span className="flex-1 truncate">
                                {fileUrl.split("/").pop() ||
                                  `File ${index + 1}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachedFile(fileUrl)}
                                className="h-4 w-4 p-0"
                              >
                                <X className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      id={`file-upload-${chapterIndex}-${lessonIndex}`}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Video</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        value={lesson.videoUrl || ""}
                        onChange={(e) =>
                          updateLesson(chapterIndex, lessonIndex, {
                            videoUrl: e.target.value,
                          })
                        }
                        placeholder="Video URL"
                        className="h-7 flex-1 text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById(
                              `video-upload-${chapterIndex}-${lessonIndex}`,
                            )
                            ?.click()
                        }
                        disabled={uploading}
                        className="h-7 w-7 p-0"
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!lesson.videoUrl}
                        onClick={handleDeleteVideo}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <input
                      id={`video-upload-${chapterIndex}-${lessonIndex}`}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
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
