import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStorage } from "@/hooks/use-storage";
import { Eye, File, Trash2 } from "lucide-react";
import React, { memo, useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";

type FileDropzoneProps = {
  onFilesSelected?: (files: File[]) => void;
  onFilesRemoved?: (file: File[], url: string[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  previews?: string[];
};

const FileDropzone: React.FC<FileDropzoneProps> = ({
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
}) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const { getFileRelativeUrl } = useStorage();
  const [viewingFile, setViewingFile] = useState<{
    file: FileWithPath;
    url: string;
    index: number;
  } | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles(acceptedFiles);
      // const previewUrls = acceptedFiles.map((file) =>
      //   URL.createObjectURL(file),
      // );
      // setPreviews(previewUrls);
      onFilesSelected?.(acceptedFiles);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    onDropRejected: (_, event) => {
      toast.error("You can only upload up to " + maxFiles + " files.");
    },
  });

  const handleViewFile = (file: FileWithPath, url: string, index: number) => {
    setViewingFile({ file, url, index });
  };

  const handleRemoveAllFiles = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));

    if (onFilesRemoved) {
      const filesToRemove = files.slice(); // Create a copy of files array
      const urlsToRemove = previews.map((url) => getFileRelativeUrl(url));
      onFilesRemoved?.(filesToRemove, urlsToRemove);
    }

    setFiles([]);
    onFilesSelected?.([]);
    toast.success(`${files.length} file(s) removed successfully`);
  };

  const handleCloseViewer = () => {
    setViewingFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 bg-background hover:border-primary/50 hover:bg-muted/50"
        } `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <File className="text-muted-foreground h-8 w-8" />
          <p className="text-sm font-medium">
            {isDragActive
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
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 gap-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {previews.map((url, i) => {
              const file = files[i];
              if (!file) return null;

              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");
              const isPdf = file.type === "application/pdf";

              return (
                <div
                  key={url}
                  className="group bg-card relative overflow-hidden rounded-lg border transition-all duration-200 hover:shadow-md"
                >
                  {/* Preview Area */}
                  <div className="bg-muted/50 relative flex aspect-square items-center justify-center overflow-hidden">
                    {isImage && (
                      <img
                        src={url}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                    )}

                    {isVideo && (
                      <video
                        src={url}
                        className="h-full w-full object-cover"
                        muted
                      />
                    )}

                    {isPdf && (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <File className="h-12 w-12 text-red-500" />
                        <span className="text-center text-xs font-medium">
                          PDF Document
                        </span>
                      </div>
                    )}

                    {!isImage && !isVideo && !isPdf && (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <File className="text-muted-foreground h-12 w-12" />
                        <span className="text-center text-xs font-medium">
                          File
                        </span>
                      </div>
                    )}

                    {/* Overlay with View Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewFile(file, url, i)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-3">
                    <p
                      className="truncate text-xs font-medium"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      <Dialog open={!!viewingFile} onOpenChange={handleCloseViewer}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate">{viewingFile?.file.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[70vh] items-center justify-center overflow-auto">
            {viewingFile && (
              <>
                {viewingFile.file.type.startsWith("image/") && (
                  <img
                    src={viewingFile.url}
                    alt={viewingFile.file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                )}

                {viewingFile.file.type.startsWith("video/") && (
                  <video
                    src={viewingFile.url}
                    controls
                    className="max-h-full max-w-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}

                {viewingFile.file.type === "application/pdf" && (
                  <iframe
                    src={viewingFile.url}
                    className="h-[70vh] w-full"
                    title={viewingFile.file.name}
                  />
                )}

                {!viewingFile.file.type.startsWith("image/") &&
                  !viewingFile.file.type.startsWith("video/") &&
                  viewingFile.file.type !== "application/pdf" && (
                    <div className="flex flex-col items-center gap-4 p-8">
                      <File className="text-muted-foreground h-16 w-16" />
                      <div className="text-center">
                        <p className="font-medium">{viewingFile.file.name}</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {formatFileSize(viewingFile.file.size)}
                        </p>
                        <p className="text-muted-foreground mt-2 text-xs">
                          This file type cannot be previewed
                        </p>
                      </div>
                      <Button asChild>
                        <a
                          href={viewingFile.url}
                          download={viewingFile.file.name}
                          className="gap-2"
                        >
                          Download File
                        </a>
                      </Button>
                    </div>
                  )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(FileDropzone);
