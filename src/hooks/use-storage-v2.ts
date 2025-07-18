import api from "@/components/utils/requestUtils";

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
      throw error;
    }
  };

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await api.postWithFormData<string[]>(
        "/api/storage/upload/images",
        formData,
      );
      return response;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const deleteFiles = async (filePaths: string[]) => {
    try {
      await api.put("/api/storage/remove/files", { filePaths });
    } catch (error) {
      console.error("Error deleting files:", error);
      throw error;
    }
  };

  const removeVideo = async (filePath: string) => {
    try {
      await api.delete(
        `/api/storage/remove/video/` + encodeURIComponent(filePath),
      );
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  };

  const downloadBlob = async (filePath: string) => {
    try {
      const response = await api.post(`/api/storage/download/file`, {
        objectName: getFileRelativeUrl(filePath),
      });
      return new Blob([response], { type: "text/vtt" });
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  };

  const downloadFile = async (filePath: string) => {
    try {
      const response = await api.get(
        `/api/storage/download/file/${getFileName(filePath)}`,
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  };

  const getDownloadUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/download/file/${getFileName(filePath)}`;
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

  const getFileName = (filePath: string) => {
    return filePath.split("/").pop() || "";
  };

  return {
    uploadVideo,
    removeVideo,
    getFileUrl,
    getFileRelativeUrl,
    uploadFiles,
    uploadImages,
    deleteFiles,
    downloadBlob,
    downloadFile,
    getFileName,
    getDownloadUrl,
  };
}
