import { useAuth } from "@/components/contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface FileObject {
  name: string;
  bucket_id: string;
  owner: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

export interface ResourceType {
  name: string;
  created_at: string;
  path: string;
  url: string;
}

export function useStorage({
  bucket = "estudy",
  prefix = "resources",
}: {
  bucket?: string;
  prefix?: string;
} = {}) {
  const { getId } = useAuth();
  const bucketAPI = supabase.storage.from(bucket);
  async function uploadFile(file: File, path: string) {
    const { data, error } = await bucketAPI.upload(
      [prefix, getId(), path].filter(Boolean).join("/"),
      file,
      {
        cacheControl: "3600",
        upsert: false,
      },
    );

    if (error) throw error;
    return data.path;
  }

  async function removeFile(path: string) {
    await bucketAPI.remove([path]);
  }

  function getFileUrl(path: string) {
    const {
      data: { publicUrl },
    } = bucketAPI.getPublicUrl(path);
    return publicUrl;
  }

  function getFilePath(name: string) {
    return [prefix, getId(), name].filter(Boolean).join("/");
  }

  async function getResources(limit = 20, offset = 0): Promise<ResourceType[]> {
    const { data, error } = await bucketAPI.list(
      [prefix, getId()].filter(Boolean).join("/"),
      {
        limit,
        offset,
        sortBy: { column: "created_at", order: "desc" },
      },
    );

    if (error) throw error;
    return (data as FileObject[]).map((file) => ({
      name: file.name,
      created_at: file.created_at,
      path: ["resources", getId(), file.name].filter(Boolean).join("/"),
      url: getFileUrl(
        ["resources", getId(), file.name].filter(Boolean).join("/"),
      ),
    }));
  }

  async function deleteResource(path: string) {
    const { error } = await bucketAPI.remove([path]);
    if (error) throw error;
  }

  return {
    uploadFile,
    getFileUrl,
    removeFile,
    getResources,
    deleteResource,
    getFilePath,
  };
}
