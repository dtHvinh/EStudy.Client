import { GetCourseToLearnChapterResponse } from "@/hooks/use-get-course-to-learn";
import { SubtitleCue } from "@/lib/srt-parser";
import { cn } from "@/lib/utils";
import { useVideoStateStore } from "@/stores/video-state-store";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { IconFile, IconListTree } from "@tabler/icons-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  FileText,
  Minus,
  Play,
} from "lucide-react";
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

export default function CourseSidebar({
  chapters,
  onLessionSelected,
}: {
  chapters: GetCourseToLearnChapterResponse[];
  onLessionSelected?: (lessonIndex: number) => void;
}) {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    if (chapters.length > 0 && !expandedSections.includes(0)) {
      setExpandedSections([0]);
      onLessionSelected?.(0);
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

        <TabsContent value="content">
          {chapters.map((section, sectionIndex) => (
            <Collapsible
              open={expandedSections.includes(sectionIndex)}
              onOpenChange={() => toggleSection(sectionIndex)}
              key={sectionIndex}
            >
              <CollapsibleTrigger className="hover:bg-muted flex w-full items-center justify-between border-b p-5 text-left">
                <div>
                  <p className="text-xl font-semibold">
                    Section {sectionIndex + 1}: {section.title}
                  </p>
                  <div className="flex h-5 items-center space-x-4 text-sm">
                    <div>
                      {section.lessons.filter((l) => l.isCompleted).length} /{" "}
                      {section.lessons.length}
                    </div>
                    <Separator orientation="vertical" />
                    <div>{section.totalMinutes} mins</div>
                  </div>
                </div>
                {expandedSections.includes(sectionIndex) ? (
                  <Minus />
                ) : (
                  <ChevronDown />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-1">
                {section.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded p-2 pl-8"
                    onClick={() => onLessionSelected?.(lessonIndex)}
                  >
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="text-muted-foreground h-4 w-4" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        {lesson.videoUrl ? (
                          <Play className="h-3 w-3" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        <span>{lesson.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
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
    <div ref={parentRef} className="h-[calc(100vh-2*80px)] overflow-auto p-5">
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
  const unsub = useVideoStateStore.subscribe((state) => {
    const playedTime = state.playedSeconds;
    setIsActive(playedTime >= cue.startTime && playedTime <= cue.endTime);
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

  return (
    <div
      ref={ref}
      className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm transition-colors"
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
