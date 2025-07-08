import { useAuth } from "@/components/contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";
import { useCallback, useRef } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const client = createClient(supabaseUrl, supabaseKey);

export const supabase = () => client;

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
  const bucketAPI = supabase().storage.from(bucket);

  const pendingDeletionsRef = useRef<Set<string>>(new Set());
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const executeBatchedDeletion = useCallback(async () => {
    if (pendingDeletionsRef.current.size === 0) return;

    const pathsToDelete = Array.from(pendingDeletionsRef.current);
    pendingDeletionsRef.current.clear();

    try {
      console.log("Batch deleting files:", pathsToDelete);
      await removeFiles(pathsToDelete);
    } catch (error) {
      console.error("Failed to batch delete files:", error);
    }
  }, []);

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

  async function removeFiles(paths: string[]) {
    const { error } = await bucketAPI.remove(paths);
    if (error) throw error;
  }

  function getFileUrl(path: string) {
    const {
      data: { publicUrl },
    } = bucketAPI.getPublicUrl(path);
    return publicUrl;
  }

  function getFileRelativeUrl(fullPath: string) {
    return fullPath.replace(
      `${supabaseUrl}/storage/v1/object/public/` + bucket + "/",
      "",
    );
  }

  function getFilesUrl(paths: string[]): string[] {
    return paths.map((path) => getFileUrl(path));
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

  function deleteResource(path: string) {
    console.log("Queueing deletion:", path);
    pendingDeletionsRef.current.add(path);

    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    deleteTimeoutRef.current = setTimeout(() => {
      executeBatchedDeletion();
    }, 1000);
  }

  return {
    uploadFile,
    getFileUrl,
    getResources,
    deleteResource,
    getFilePath,
    removeFiles,
    getFilesUrl,
    getFileRelativeUrl,
  };
}
