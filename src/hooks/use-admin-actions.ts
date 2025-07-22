import api from "@/components/utils/requestUtils";
import { toast } from "sonner";

export default function useAdminActions() {
  const changeBlogVisibility = async (blogId: string, visible: boolean) => {
    try {
      await api.put(`/api/admin/content-moderator/blogs/visibility`, {
        blogId,
        isVisible: visible,
      });
      toast.success(
        `Blog visibility changed to ${visible ? "visible" : "hidden"}`,
      );
    } catch (error) {
      toast.error("Failed to change blog visibility. Please try again later.");
      console.error("Error changing blog visibility:", error);
    }
  };

  return {
    changeBlogVisibility,
  };
}
