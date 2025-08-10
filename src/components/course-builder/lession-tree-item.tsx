"use client";

import TailwindEditor from "@/components/text-editor/text-editor";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type CourseLesson,
  useEditCourseStructure,
} from "@/hooks/use-edit-course-structure";
import useStorageV2 from "@/hooks/use-storage-v2";
import {
  ChevronDown,
  ChevronRight,
  Paperclip,
  Play,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
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
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function LessonTreeItem({
  lesson,
  chapterIndex,
  lessonIndex,
  dragHandleProps,
  isExpanded = false,
  onToggle,
}: LessonTreeItemProps) {
  const {
    uploadVideo,
    removeVideo,
    getFileRelativeUrl,
    getFileUrl,
    uploadFiles,
    deleteFiles,
  } = useStorageV2();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Scroll to this lesson when created
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const debounceUpdateLesson = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateLesson(chapterIndex, lessonIndex, {
        description: e.target.value,
      });
    },
    500,
  );
  const {
    updateLesson,
    deleteLesson,
    setAttachmentUrls,
    clearAttachments,
    setVideoUrl,
    deleteVideo,
    chapter,
    setTranscriptUrl,
    deleteTranscript,
  } = useEditCourseStructure(
    useShallow((state) => ({
      updateLesson: state.updateLesson,
      deleteLesson: state.deleteLesson,
      setAttachmentUrls: state.setAttachmentUrls,
      clearAttachments: state.clearAttachments,
      setVideoUrl: state.setVideoUrl,
      deleteVideo: state.deleteVideo,
      chapter: state.chapters[chapterIndex],
      setTranscriptUrl: state.setTranscriptUrl,
      deleteTranscript: state.deleteTranscript,
    })),
  );

  const handleSetAttachments = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      if (lesson.attachedFileUrls.length > 0) {
        await deleteFiles(lesson.attachedFileUrls);
      }

      const urls = await uploadFiles(files);
      setAttachmentUrls(chapterIndex, lessonIndex, urls);
    } catch (error) {
      console.error("Failed to handle attachments:", error);
    }
  };

  const handleSetVideo = async (files: File[]) => {
    if (files.length === 0) return;
    const path = await uploadVideo(files[0]);
    setVideoUrl(chapterIndex, lessonIndex, path);
  };

  const handleDeleteAttachments = async () => {
    clearAttachments(chapterIndex, lessonIndex);
    await deleteFiles(lesson.attachedFileUrls);
  };

  const handleDeleteVideo = async () => {
    removeVideo(lesson.videoUrl!);
    deleteVideo(chapterIndex, lessonIndex);
  };

  const handleDeleteTranscript = async () => {
    deleteFiles([lesson.transcriptUrl!]);
    deleteTranscript(chapterIndex, lessonIndex);
  };

  const handleSetTranscript = async (files: File[]) => {
    if (files.length === 0) return;
    const path = await uploadFiles([files[0]]);
    setTranscriptUrl(chapterIndex, lessonIndex, path[0]);
  };

  return (
    <div ref={ref} className="group ml-4">
      <div className="hover:bg-muted/20 flex items-start gap-2 rounded-md py-1 transition-colors">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Collapsible open={isExpanded} className="flex-1">
            <div className="flex flex-1 gap-2">
              <Button
                variant={"ghost"}
                onClick={onToggle}
                className="hover:bg-muted/50 flex items-center gap-2 rounded-md p-1"
              >
                {isExpanded ? (
                  <ChevronDown className="text-muted-foreground h-3 w-3" />
                ) : (
                  <ChevronRight className="text-muted-foreground h-3 w-3" />
                )}
              </Button>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span>
                  <span className="font-semibold">{chapter.title}</span>
                </span>
                <Play className="text-primary/70 h-3 w-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <Input
                      defaultValue={lesson.title}
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
                      className="hover:text-primary text-md w-full truncate rounded-md bg-gray-100 p-2 text-left transition-colors"
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
                        previews={lesson.attachedFileUrls}
                        getFileUrlFn={getFileUrl}
                        getFileRelativeUrlFn={getFileRelativeUrl}
                        notVideo={true}
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
                        previews={lesson.videoUrl ? [lesson.videoUrl] : []}
                        getFileUrlFn={getFileUrl}
                        getFileRelativeUrlFn={getFileRelativeUrl}
                        notVideo={false}
                      />
                    </div>

                    {lesson.videoUrl && (
                      <div className="mt-4">
                        <Label className="mb-1 text-xs">Transcript</Label>
                        <div className="space-y-2">
                          {lesson.transcriptUrl ? (
                            <div className="flex items-center gap-2">
                              <span className="truncate rounded-md border p-2">
                                {lesson.transcriptUrl}
                              </span>
                              <Button
                                variant={"outline"}
                                className="hover:bg-destructive/10 h-6 w-6"
                                onClick={handleDeleteTranscript}
                              >
                                <Trash2 className="text-destructive" />
                              </Button>
                            </div>
                          ) : (
                            <input
                              type="file"
                              accept=".srt,.vtt"
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleSetTranscript(
                                    Array.from(e.target.files),
                                  );
                                }
                              }}
                              className="w-full rounded-md border p-2"
                            />
                          )}
                        </div>
                      </div>
                    )}
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
