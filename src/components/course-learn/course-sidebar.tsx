import { GetCourseToLearnChapterResponse } from "@/hooks/use-get-course-to-learn";
import { useStorage } from "@/hooks/use-storage";
import { parseSRT, SubtitleCue } from "@/lib/srt-parser";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { IconFile, IconListTree } from "@tabler/icons-react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  FileText,
  Minus,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent } from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CourseSidebar({
  chapters,
  onLessionSelected,
  transcriptUrl,
}: {
  chapters: GetCourseToLearnChapterResponse[];
  transcriptUrl?: string;
  onLessionSelected?: (lessonIndex: number) => void;
}) {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const { downloadFile } = useStorage();
  const [subtitleCues, setSubtitleCues] = useState<SubtitleCue[]>([]);
  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    if (!transcriptUrl) return;
    let blob: Blob;
    const download = async () => {
      try {
        blob = await downloadFile(transcriptUrl);
        setSubtitleCues(parseSRT(await blob.text()));
      } catch (err) {
        console.error("Failed to load transcript:", err);
      }
    };

    download();
  }, [transcriptUrl]);

  useEffect(() => {
    if (chapters.length > 0 && !expandedSections.includes(0)) {
      setExpandedSections([0]);
      onLessionSelected?.(0);
    }
  }, [chapters]);

  return (
    <Tabs defaultValue="content">
      <ScrollArea className="h-[calc(100vh-80px)] border-l">
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
          {subtitleCues.length > 0 ? (
            <div className="space-y-2 p-5">
              {subtitleCues.map((cue, i) => (
                <SubtitleLine key={i} cue={cue} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground p-5">
              No transcript available for this lesson.
            </p>
          )}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}

const SubtitleLine = ({ cue }: { cue: SubtitleCue }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="text-sm">
          <div className="text-muted-foreground cursor-default">{cue.text}</div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-muted-foreground text-xs">
          {cue.startTime}-{cue.endTime}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
