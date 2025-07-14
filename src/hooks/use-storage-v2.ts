import api from "@/components/utils/requestUtils";
import { toast } from "sonner";

export default function useStorageV2() {
  const uploadVideo = async (file: File) => {
    try {
      const response = await api.postWithFormData<{ videoUrl: string }>(
        "/api/storage/upload/video",
        {
          file,
        },
      );
      return response.videoUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload video. Please try again.");
      throw error;
    }
  };

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await api.postWithFormData<string[]>(
        "/api/storage/upload/files",
        formData,
      );
      return response;
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files. Please try again.");
      throw error;
    }
  };

  const deleteFiles = async (filePaths: string[]) => {
    try {
      await api.put("/api/storage/remove/files", { filePaths });
      toast.success("Files deleted successfully.");
    } catch (error) {
      console.error("Error deleting files:", error);
      toast.error("Failed to delete files. Please try again.");
      throw error;
    }
  };

  const removeVideo = async (filePath: string) => {
    try {
      await api.delete(
        `/api/storage/remove/video/` + encodeURIComponent(filePath),
      );
      toast.success("Video deleted successfully.");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video. Please try again.");
      throw error;
    }
  };

  const getFileUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/estudy/${filePath}`;
  };

  const getFileRelativeUrl = (filePath: string) => {
    return filePath.replace(
      `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/estudy/`,
      "",
    );
  };

  return {
    uploadVideo,
    removeVideo,
    getFileUrl,
    getFileRelativeUrl,
    uploadFiles,
    deleteFiles,
  };
}
