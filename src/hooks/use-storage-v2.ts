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

  const getVideoFileUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/estudy/${filePath}`;
  };

  const getVideoFileRelativeUrl = (filePath: string) => {
    return filePath.replace(
      `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/estudy/`,
      "",
    );
  };

  return {
    uploadVideo,
    removeVideo,
    getVideoFileUrl,
    getVideoFileRelativeUrl,
  };
}
