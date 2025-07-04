"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CourseLesson,
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

interface LessonCardProps {
  lesson: CourseLesson;
  chapterIndex: number;
  lessonIndex: number;
  dragHandleProps?: any;
}

export function LessonCard({
  lesson,
  chapterIndex,
  lessonIndex,
  dragHandleProps,
}: LessonCardProps) {
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { uploadFile } = useStorage({ prefix: "course-items" });
  const { updateLesson, deleteLesson } = useCreateCourseStructure();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `lesson-files/${Date.now()}-${file.name}`;
        const fileUrl = await uploadFile(file, fileName);
        return fileUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Combine with existing attached files
      const existingUrls = lesson.attachedFileUrls
        ? lesson.attachedFileUrls.split(",").filter((url) => url.trim())
        : [];
      const allUrls = [...existingUrls, ...uploadedUrls];

      updateLesson(chapterIndex, lessonIndex, {
        attachedFileUrls: allUrls.join(","),
      });

      toast.success(`${uploadedUrls.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload files");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `lesson-thumbnails/${Date.now()}-${file.name}`;
      const thumbnailUrl = await uploadFile(file, fileName);
      updateLesson(chapterIndex, lessonIndex, { thumbnailUrl });
      toast.success("Thumbnail uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachedFile = (urlToRemove: string) => {
    const currentUrls = lesson.attachedFileUrls
      ? lesson.attachedFileUrls.split(",").filter((url) => url.trim())
      : [];
    const updatedUrls = currentUrls.filter((url) => url !== urlToRemove);
    updateLesson(chapterIndex, lessonIndex, {
      attachedFileUrls: updatedUrls.join(","),
    });
  };

  const attachedFiles = lesson.attachedFileUrls
    ? lesson.attachedFileUrls.split(",").filter((url) => url.trim())
    : [];

  return (
    <Card className="border-l-primary/20 border-l-4">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground h-4 w-4" />
          </div>

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex-1"
          >
            <CollapsibleTrigger className="hover:bg-muted/50 -ml-2 flex w-full items-center gap-2 rounded-md p-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Play className="h-4 w-4" />
              <span className="flex-1 text-left font-medium">
                {lesson.title || `Lesson ${lessonIndex + 1}`}
              </span>
              {lesson.durationMinutes > 0 && (
                <span className="text-muted-foreground text-sm">
                  {lesson.durationMinutes}min
                </span>
              )}
              {attachedFiles.length > 0 && (
                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Paperclip className="h-3 w-3" />
                  {attachedFiles.length}
                </span>
              )}
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor={`lesson-title-${chapterIndex}-${lessonIndex}`}
                  >
                    Lesson Title
                  </Label>
                  <Input
                    id={`lesson-title-${chapterIndex}-${lessonIndex}`}
                    value={lesson.title}
                    onChange={(e) =>
                      updateLesson(chapterIndex, lessonIndex, {
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <Label
                    htmlFor={`lesson-duration-${chapterIndex}-${lessonIndex}`}
                  >
                    Duration (minutes)
                  </Label>
                  <Input
                    id={`lesson-duration-${chapterIndex}-${lessonIndex}`}
                    type="number"
                    value={lesson.durationMinutes}
                    onChange={(e) =>
                      updateLesson(chapterIndex, lessonIndex, {
                        durationMinutes: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor={`lesson-description-${chapterIndex}-${lessonIndex}`}
                >
                  Description
                </Label>
                <Textarea
                  id={`lesson-description-${chapterIndex}-${lessonIndex}`}
                  value={lesson.description || ""}
                  onChange={(e) =>
                    updateLesson(chapterIndex, lessonIndex, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the lesson"
                  rows={2}
                />
              </div>

              <div>
                <Label
                  htmlFor={`lesson-content-${chapterIndex}-${lessonIndex}`}
                >
                  Lesson Content
                </Label>
                <Textarea
                  id={`lesson-content-${chapterIndex}-${lessonIndex}`}
                  value={lesson.content}
                  onChange={(e) =>
                    updateLesson(chapterIndex, lessonIndex, {
                      content: e.target.value,
                    })
                  }
                  placeholder="Detailed lesson content, notes, or transcript"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Attached Files</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
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
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Uploading..." : "Upload Files"}
                      </Button>
                    </div>

                    {attachedFiles.length > 0 && (
                      <div className="space-y-1">
                        {attachedFiles.map((fileUrl, index) => (
                          <div
                            key={index}
                            className="bg-muted flex items-center gap-2 rounded-md p-2"
                          >
                            <Paperclip className="h-3 w-3" />
                            <span className="flex-1 truncate text-sm">
                              {fileUrl.split("/").pop() || `File ${index + 1}`}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachedFile(fileUrl)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
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
                  <Label>Thumbnail</Label>
                  <div className="flex gap-2">
                    <Input
                      value={lesson.thumbnailUrl || ""}
                      onChange={(e) =>
                        updateLesson(chapterIndex, lessonIndex, {
                          thumbnailUrl: e.target.value,
                        })
                      }
                      placeholder="Thumbnail URL or upload file"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document
                          .getElementById(
                            `thumbnail-upload-${chapterIndex}-${lessonIndex}`,
                          )
                          ?.click()
                      }
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <input
                    id={`thumbnail-upload-${chapterIndex}-${lessonIndex}`}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteLesson(chapterIndex, lessonIndex)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
