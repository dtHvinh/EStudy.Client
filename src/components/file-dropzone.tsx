import { Button } from "@/components/ui/button";
import { File, Loader2, Trash2 } from "lucide-react";
import React, { memo, useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import MediaRenderer from "./resources/media-renderer";

type FileDropzoneProps = {
  onFilesSelected?: (files: File[]) => void;
  onFilesRemoved?: (urls: string[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  previews?: string[];
  isLoading?: boolean;
  getFileRelativeUrlFn: (url: string) => string;
  getFileUrlFn: (url: string) => string;
};

const FileDropzone: React.FC<FileDropzoneProps & { notVideo: boolean }> = ({
  onFilesSelected,
  onFilesRemoved,
  accept = {
    "image/*": [],
    "video/*": [],
    "application/pdf": [],
    "application/*": [],
    "text/*": [],
    "audio/*": [],
  },
  maxFiles = 5,
  previews = [],
  isLoading = false,
  getFileRelativeUrlFn: getFileRelativeUrl,
  getFileUrlFn: getFileUrl,
  notVideo,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      onFilesSelected?.(acceptedFiles);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: isLoading,
    onDropRejected: (_, event) => {
      toast.error(
        "You can only upload up to " +
          maxFiles +
          " files. And each file must be smaller than 10MB.",
      );
    },
    maxSize: notVideo ? 10 * 1024 * 1024 : undefined,
  });

  const handleRemoveAllFiles = () => {
    if (onFilesRemoved) {
      const urlsToRemove = previews.map((url) => getFileRelativeUrl(url));
      onFilesRemoved(urlsToRemove);
    }
    toast.success(`${previews.length} file(s) removed successfully`);
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 bg-background hover:border-primary/50 hover:bg-muted/50"
        } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isLoading ? (
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          ) : (
            <File className="text-muted-foreground h-8 w-8" />
          )}
          <p className="text-sm font-medium">
            {isLoading
              ? "Processing files..."
              : isDragActive
                ? "Drop files here..."
                : "Drag & drop or click to upload files"}
          </p>
          <p className="text-muted-foreground text-xs">
            Maximum {maxFiles} files supported
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground text-sm font-medium">
              Uploaded Files ({previews.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAllFiles}
              disabled={isLoading}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete All
            </Button>
          </div>

          <div
            className={`grid grid-cols-${Math.min(2, previews.length)} gap-2`}
          >
            {previews.map((url, i) => (
              <MediaRenderer key={i} url={getFileUrl(url)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(FileDropzone);
