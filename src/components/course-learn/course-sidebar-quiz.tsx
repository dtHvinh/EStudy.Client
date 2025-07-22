import { GetCourseToLearnQuizResponse } from "@/hooks/use-learn-course";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, HelpCircle } from "lucide-react";

export default function CourseSidebarQuiz({
  quiz,
  isQuizSelected,
  onQuizSelected,
}: {
  quiz: GetCourseToLearnQuizResponse;
  isQuizSelected?: boolean;
  onQuizSelected?: () => void;
}) {
  return (
    <div
      className={cn(
        "hover:bg-muted flex cursor-pointer items-center justify-between gap-3 rounded p-3 pl-8 transition-colors",
        isQuizSelected && "bg-muted",
      )}
      onClick={onQuizSelected}
    >
      <div className="flex flex-1 items-center gap-3">
        {/* Completion Status Icon */}
        {quiz.isCompleted ? (
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
        ) : (
          <Circle className="text-muted-foreground h-4 w-4 flex-shrink-0" />
        )}

        {/* Quiz Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p
              className={cn(
                "truncate text-sm font-medium",
                quiz.isCompleted && "text-muted-foreground",
              )}
            >
              {quiz.title}
            </p>
          </div>

          {/* Quiz Metadata */}
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              <span>{quiz.questions?.length || 0} questions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
