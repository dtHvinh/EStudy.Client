"use client";

import { ErrorCard } from "@/components/error-card";
import HTMLContent from "@/components/html-content";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import TailwindEditor from "@/components/text-editor/text-editor";
import H3 from "@/components/ui/h3";
import useBlogDetail from "@/hooks/use-blog-detail";
import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const { blog, isLoading, error, syncBlog } = useBlogDetail(id);
  const [title, setTitle] = useState<string>("untitled");

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "untitled");
    }
  }, [blog]);

  const handleHTHMLUpdate = async (
    jsonContent: JSONContent,
    htmlContent: string,
  ) => {
    setTitle(getTitle(jsonContent));
    await syncBlog(getTitle(jsonContent), htmlContent);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center space-x-2 text-gray-500">
          <Loader2Icon className="animate-spin" />
          <div>Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorCard message="The document is not found or you don't have permission to access it" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {blog &&
        (!blog.isReadOnly ? (
          <>
            <Title title={title} />
            <div spellCheck={false} className="pb-9 md:px-20">
              <TailwindEditor
                autoFocus
                initialContent={blog.content}
                onContentUpdate={handleHTHMLUpdate}
              />
            </div>
          </>
        ) : (
          <>
            <Title title={title} />
            <div spellCheck={false} className="pb-9 md:px-20">
              <HTMLContent content={blog.content} />
            </div>
          </>
        ))}
    </MainLayout>
  );
}

const Title = ({ title }: { title: string; isLock?: boolean }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 pb-2 lg:px-6">
      <div className="flex items-center gap-2">
        <NavigateBack />
        <H3 className="text-muted-foreground">{title}</H3>
      </div>
      <div></div>
    </div>
  );
};

const getTitle = (json: JSONContent | undefined) => {
  if (!json || !json.content) return "untitled";
  if (json.content.length > 0) {
    const firstNode = json.content[0];
    return firstNode.content?.[0]?.text || "untitled";
  }
  return "untitled";
};
