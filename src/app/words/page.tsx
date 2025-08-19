"use client";

import MainLayout from "@/components/layouts/MainLayout";
import Loading from "@/components/loading";
import H3 from "@/components/ui/h3";
import api from "@/components/utils/requestUtils";
import WordSearchBar from "@/components/words/search-bar";
import WordCard from "@/components/words/word-card";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

interface Word {
  id: number | string;
  text: string;
}

interface GroupedWords {
  [key: string]: Word[];
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const getKey = (pageIndex: number, previousPageData: any) => {
    return `/api/words?page=${pageIndex + 1}&pageSize=24&name=${encodeURIComponent(searchQuery)}`;
  };

  const { data, isLoading, error, setSize } = useSWRInfinite<Word[]>(
    getKey,
    api.get,
    {
      parallel: true,
    },
  );

  useEffect(() => {
    if (isLoading) {
      toast.message(<Loading text="Loading words" />, {
        id: "loading-words",
      });
    } else {
      toast.dismiss("loading-words");
    }
  }, [isLoading]);

  const words = data ? data.flat() : [];

  // Group words by their first letter and filter by search query
  const groupedWords = useMemo(() => {
    const filteredWords = words.filter((word) =>
      word.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const groups: GroupedWords = {};

    filteredWords.forEach((word) => {
      const firstLetter = word.text.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(word);
    });

    // Sort groups alphabetically
    const sortedGroups: GroupedWords = {};
    Object.keys(groups).forEach((key) => {
      sortedGroups[key] = groups[key].sort((a, b) =>
        a.text.localeCompare(b.text),
      );
    });

    return sortedGroups;
  }, [words, searchQuery]);

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        console.log("Loading more words...");
        setSize((size) => size + 1);
      }
    },
  });

  return (
    <MainLayout>
      {/* Sticky Search Bar */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="px-4 py-4 lg:px-6">
          <div className="flex items-center gap-4">
            <H3 className="flex-shrink-0">Words</H3>
            <div className="max-w-md flex-1">
              <WordSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-6">
        {error ? (
          <div className="text-muted-foreground mt-8 text-center">
            Failed to load words. Please try again later.
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {Object.keys(groupedWords).length === 0 && searchQuery ? (
              <div className="mt-12 text-center">
                <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                  <span className="text-muted-foreground text-2xl">🔍</span>
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No words found
                </h3>
                <p className="text-muted-foreground">
                  No words match your search for "{searchQuery}". Try a
                  different search term.
                </p>
              </div>
            ) : (
              Object.entries(groupedWords).map(([letter, letterWords]) => (
                <div key={letter} className="group">
                  {/* Letter Header */}
                  <div className="mb-6 flex items-center">
                    <div className="from-primary/20 to-primary/10 border-primary/20 flex h-20 w-20 items-center justify-center rounded-2xl border-2 bg-gradient-to-br shadow-lg">
                      <span className="text-primary text-4xl font-bold">
                        {letter}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="from-border h-px bg-gradient-to-r to-transparent"></div>
                    </div>
                    <div className="bg-muted ml-4 rounded-full px-3 py-1">
                      <span className="text-muted-foreground text-sm font-medium">
                        {letterWords.length} word
                        {letterWords.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {letterWords.map((word) => (
                      <WordCard
                        key={word.id}
                        word={word}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
            <div className="h-4 w-full bg-transparent" ref={ref} />

            {/* Empty state */}
            {!isLoading && words.length === 0 && !searchQuery && (
              <div className="mt-12 text-center">
                <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                  <span className="text-muted-foreground text-2xl">📝</span>
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No words found
                </h3>
                <p className="text-muted-foreground">
                  There are no words to display at the moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
