import {
  GetCourseToLearnChapterResponse,
  GetCourseToLearnLessonResponse,
  GetCourseToLearnQuizResponse,
} from "@/hooks/use-learn-course";
import { SubtitleCue } from "@/lib/srt-parser";
import { cn } from "@/lib/utils";
import { useVideoStateStore } from "@/stores/video-state-store";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { IconFile, IconListTree } from "@tabler/icons-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent } from "../ui/tabs";
import CourseSidebarLesson from "./course-sidebar-lesson";
import CourseSidebarQuiz from "./course-sidebar-quiz";

function findFirstIncompleteLesson(
  chapters: GetCourseToLearnChapterResponse[],
): [number, number] {
  for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
    const lessons = chapters[chapterIndex].lessons;
    for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
      if (!lessons[lessonIndex].isCompleted) {
        return [chapterIndex, lessonIndex];
      }
    }
  }
  return [0, 0];
}

export default function CourseSidebar({
  chapters,
  currentLesson,
  currentQuiz,
  onLessionSelected,
  onQuizSelected,
}: {
  currentLesson?: GetCourseToLearnLessonResponse;
  currentQuiz?: GetCourseToLearnQuizResponse;
  chapters: GetCourseToLearnChapterResponse[];
  onLessionSelected?: (chapterIndex: number, lessonIndex: number) => void;
  onQuizSelected?: (chapterIndex: number, quizIndex: number) => void;
}) {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const toggleSection = (index: number) => {
    setExpandedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    if (chapters.length > 0 && !expandedChapters.includes(0)) {
      const [initialChapterIndex, initialLessonIndex] =
        findFirstIncompleteLesson(chapters);
      setExpandedChapters([initialChapterIndex]);
      onLessionSelected?.(initialChapterIndex, initialLessonIndex);
    }
  }, [chapters]);

  return (
    <Tabs defaultValue="content">
      <ScrollArea className="h-[calc(100vh-80px)] rounded-b-2xl border-b border-l">
        <div className="flex items-center justify-between border-b p-5">
          <p className="text-xl font-semibold">
            {activeTab === "content" ? "Course Content" : "Transcript"}
          </p>
          <TabsList className="flex items-center space-x-2">
            <TabsTrigger
              value="content"
              onClick={() => setActiveTab("content")}
              className="cursor-pointer"
            >
              <IconListTree className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              onClick={() => setActiveTab("transcript")}
              className="cursor-pointer"
            >
              <IconFile className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Render chapters */}
        <TabsContent value="content">
          {chapters.map((chapter, sectionIndex) => {
            const isChapterSelected = chapter.lessons.some(
              (lesson) => lesson.id === currentLesson?.id,
            );
            return (
              <Collapsible
                open={expandedChapters.includes(sectionIndex)}
                onOpenChange={() => toggleSection(sectionIndex)}
                key={sectionIndex}
              >
                <CollapsibleTrigger
                  className={cn(
                    "hover:bg-muted flex w-full items-center justify-between border-b p-5 text-left",
                    isChapterSelected && "bg-muted",
                  )}
                >
                  <div>
                    <p className="text-xl font-semibold">
                      Chapter {sectionIndex + 1}: {chapter.title}
                    </p>
                    <div className="flex h-5 items-center space-x-4 text-sm">
                      <div>
                        {chapter.lessons.filter((l) => l.isCompleted).length} /{" "}
                        {chapter.lessons.length}
                      </div>
                      <Separator orientation="vertical" />
                      <div>{chapter.totalMinutes} mins</div>
                    </div>
                  </div>
                  {expandedChapters.includes(sectionIndex) ? (
                    <Minus />
                  ) : (
                    <ChevronDown />
                  )}
                </CollapsibleTrigger>

                {/* Render lessons */}
                <CollapsibleContent className="space-y-1">
                  {chapter.lessons
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((lesson, lessonIndex) => {
                      const isLessonSelected = lesson.id === currentLesson?.id;
                      const isLessonCompleted = lesson.isCompleted;
                      return (
                        <CourseSidebarLesson
                          key={lesson.id}
                          lesson={lesson}
                          isLessonSelected={isLessonSelected}
                          isLessonCompleted={isLessonCompleted}
                          onLessionSelected={() =>
                            onLessionSelected?.(sectionIndex, lessonIndex)
                          }
                        />
                      );
                    })}
                  {/* Render quizzes */}
                  {chapter.quizzes
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((quiz, quizIndex) => {
                      const isQuizSeleceted = quiz.id === currentQuiz?.id;
                      return (
                        <CourseSidebarQuiz
                          key={quiz.id}
                          quiz={quiz}
                          isQuizSelected={isQuizSeleceted}
                          onQuizSelected={() =>
                            onQuizSelected?.(sectionIndex, quizIndex)
                          }
                        />
                      );
                    })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </TabsContent>

        <TabsContent value="transcript">
          <SubtitleList />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}

const SubtitleList = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { subtitleCues } = useVideoStateStore(
    useShallow((state) => ({
      subtitleCues: state.subtitleCues || [],
    })),
  );

  const virtualizer = useVirtualizer({
    count: subtitleCues.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated height of each subtitle line with padding
    overscan: 5, // Render 5 extra items outside the visible area
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  if (subtitleCues.length === 0) {
    return (
      <div className="p-5">
        <p className="text-muted-foreground">
          No transcript available for this lesson.
        </p>
      </div>
    );
  }

  const handleSubtitleActive = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: "center",
      behavior: "smooth",
    });
  };

  return (
    <div ref={parentRef} className="h-[calc(100vh-2*80px)] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const cue = subtitleCues[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <SubtitleLine
                cue={cue}
                onSubtitleActive={() => handleSubtitleActive(virtualItem.index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SubtitleLine = ({
  cue,
  onSubtitleActive,
}: {
  cue: SubtitleCue;
  onSubtitleActive?: () => void;
}) => {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { seekTo } = useVideoStateStore(
    useShallow((state) => ({
      seekTo: state.seekTo,
    })),
  );

  const unsub = useVideoStateStore.subscribe((state) => {
    const playedTime = state.playedSeconds;
    setIsActive(playedTime > cue.startTime && playedTime < cue.endTime);
  });

  useEffect(() => {
    return () => {
      unsub();
    };
  }, [unsub]);

  useEffect(() => {
    if (isActive && onSubtitleActive) {
      onSubtitleActive();
    }
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    seekTo(cue.startTime);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "hover:bg-muted/50 flex cursor-pointer items-center gap-3 p-2 px-5 text-sm transition-colors",
        isActive && "bg-muted",
      )}
      onClick={handleClick}
    >
      <div className="text-muted-foreground min-w-0 flex-shrink-0 font-mono text-xs">
        {formatTime(cue.startTime)}
      </div>
      <div
        className={cn(
          "text-muted-foreground flex-1 leading-relaxed",
          isActive && "text-foreground font-semibold",
        )}
      >
        {cue.text}
      </div>
    </div>
  );
};
