import { GetCourseToLearnLessonResponse } from "@/hooks/use-learn-course";
import useStorageV2 from "@/hooks/use-storage-v2";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Download,
  FileText,
  Folder,
  Play,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function CourseSidebarLesson({
  lesson,
  isLessonSelected,
  isLessonCompleted,
  onLessionSelected,
}: {
  lesson: GetCourseToLearnLessonResponse;
  isLessonSelected: boolean;
  isLessonCompleted?: boolean;
  onLessionSelected?: () => void;
}) {
  return (
    <div
      className={cn(
        "hover:bg-muted flex cursor-pointer items-center justify-between gap-3 rounded p-3 pl-8",
        isLessonSelected && "bg-muted",
      )}
    >
      <div className="flex items-center gap-3" onClick={onLessionSelected}>
        {lesson.isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <Circle className="text-muted-foreground h-4 w-4" />
        )}
        <div className="flex-1">
          <p
            className={cn(
              "text-sm font-medium",
              isLessonCompleted && "text-muted-foreground",
            )}
          >
            {lesson.title}
          </p>
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
      <div>
        {(lesson.attachedFileUrls.length > 0 ||
          lesson.videoUrl ||
          lesson.transcriptUrl) && (
          <ResourceDownloadButton
            attachmentUrls={lesson.attachedFileUrls}
            videoUrl={lesson.videoUrl}
            transcriptUrl={lesson.transcriptUrl}
          />
        )}
      </div>
    </div>
  );
}

function ResourceDownloadButton({
  attachmentUrls,
  videoUrl,
  transcriptUrl,
}: {
  attachmentUrls: string[];
  videoUrl?: string;
  transcriptUrl?: string;
}) {
  const { getFileUrl, getFileName } = useStorageV2();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant="ghost">
          <Folder />

          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {attachmentUrls.length > 0 && (
          <>
            <DropdownMenuLabel>Attachments</DropdownMenuLabel>
            <DropdownMenuGroup>
              {attachmentUrls.map((url, index) => (
                <DropdownMenuItem key={index}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    <a href={getFileUrl(url)} download target="_blank">
                      {getFileName(url)}
                    </a>
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
        {videoUrl && (
          <>
            <DropdownMenuLabel>Video</DropdownMenuLabel>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                <a href={getFileUrl(videoUrl)} download target="_blank">
                  {getFileName(videoUrl)}
                </a>
              </Button>
            </DropdownMenuItem>
          </>
        )}
        {transcriptUrl && (
          <>
            <DropdownMenuLabel>Transcript</DropdownMenuLabel>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                <a href={getFileUrl(transcriptUrl)} download target="_blank">
                  {getFileName(transcriptUrl)}
                </a>
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
