"use client";

import { BlogCard, BlogCardSkeleton } from "@/components/blog-card";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBlog from "@/hooks/use-blogs";
import { BookOpen, Search } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";

export default function ExplorePage() {
  const { blogs, search, searchQuery, scrollNext, isBlogLoading } = useBlog({
    pageSize: 3,
  });
  const { ref: bottomRef, inView } = useInView();
  const debounced = useDebouncedCallback((value: string) => search(value), 250);

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  return (
    <MainLayout>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <BookOpen className="text-primary h-8 w-8" />
              <h1 className="text-foreground text-4xl font-bold">
                Explore Blogs
              </h1>
            </div>

            {/* Introductory Paragraph */}
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Discover a wealth of English learning resources through our
              curated collection of educational blogs. Search through
              expert-written articles covering grammar, vocabulary,
              pronunciation, and more to enhance your English learning journey.
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="mx-auto max-w-2xl">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  placeholder="Search for blogs about grammar, vocabulary, pronunciation..."
                  onChange={(e) => debounced(e.target.value)}
                  className="h-12 pl-10 text-base"
                  clearable={false}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center">
              <h2 className="text-foreground text-2xl font-semibold">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "All Blogs"}
              </h2>
            </div>

            {isBlogLoading ? (
              <div className="space-y-6">
                <BlogCardSkeleton number={6} />
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.length > 0 ? (
                  blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
                ) : (
                  <div className="py-12 text-center">
                    <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                    <h3 className="text-foreground mb-2 text-xl font-semibold">
                      No blogs found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or browse all available
                      blogs.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => debounced("")}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>
      </div>
    </MainLayout>
  );
}
