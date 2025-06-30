import { TestTakingSection } from "@/hooks/use-test-taking";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";

const QuestionNavigation = ({
  canGoPrevious,
  canGoNext,
  goToPreviousQuestion,
  goToNextQuestion,
  currentSection,
  currentQuestionIndex,
}: {
  canGoPrevious: boolean;
  canGoNext: boolean;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  currentSection: TestTakingSection;
  currentQuestionIndex: number;
}) => {
  return (
    <div className="flex items-center justify-between py-8 pt-4">
      <Button
        variant="outline"
        onClick={goToPreviousQuestion}
        disabled={!canGoPrevious}
        className="flex items-center gap-2 bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">{currentSection.title}</p>
        <p className="text-muted-foreground text-xs">
          Question {currentQuestionIndex + 1} of{" "}
          {currentSection.questions.length} in this section
        </p>
      </div>

      <Button
        onClick={goToNextQuestion}
        disabled={!canGoNext}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(QuestionNavigation);
