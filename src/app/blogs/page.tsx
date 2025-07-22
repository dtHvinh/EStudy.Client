"use client";

import { BlogCard, BlogCardSkeleton } from "@/components/blog-card";
import MainLayout from "@/components/layouts/MainLayout";
import RelativeLink from "@/components/relative-link";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import useBlogs, { useCreateBlog } from "@/hooks/use-my-blog";
import { IconWorld } from "@tabler/icons-react";
import { Loader2Icon, Pen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { blogs, isBlogsLoading, deleteBlog } = useBlogs();

  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="mx-4 flex items-center justify-between">
          <H3>My blogs</H3>
          <div className="flex items-center gap-2">
            <CreateBlogButton />
            <ExploreButton />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isBlogsLoading && <BlogCardSkeleton number={3} />}
          {blogs.map((blog) => (
            <BlogCard
              blog={blog}
              key={blog.id}
              onDelete={() => deleteBlog(blog.id)}
              className="h-full"
            />
          ))}
          {!isBlogsLoading && blogs.length === 0 && (
            <div className="text-center text-gray-500">
              No blogs found. Start writing your first blog!
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

const CreateBlogButton = () => {
  const { createUntitledBlog, isCreating } = useCreateBlog();
  const router = useRouter();
  const handleCreateBlog = async () => {
    const { id } = await createUntitledBlog();
    if (id) {
      router.push(`/blogs/${id}`);
    }
  };
  return (
    <Button disabled={isCreating} variant={"ghost"} onClick={handleCreateBlog}>
      {isCreating && <Loader2Icon className="animate-spin" />}
      <Pen className="h-4 w-4" /> Write a blog
    </Button>
  );
};

const ExploreButton = () => {
  return (
    <RelativeLink href="/explore">
      <Button variant="outline">
        <IconWorld /> Explore
      </Button>
    </RelativeLink>
  );
};
