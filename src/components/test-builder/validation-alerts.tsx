"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ValidationAlertsProps {
  questionType: "single-choice" | "multiple-choice";
  correctAnswersCount: number;
}

export function ValidationAlerts({
  questionType,
  correctAnswersCount,
}: ValidationAlertsProps) {
  const hasValidation =
    questionType === "single-choice" && correctAnswersCount !== 1;
  const multipleChoiceHasCorrect =
    questionType === "multiple-choice" && correctAnswersCount > 0;

  return (
    <>
      {hasValidation && (
        <Alert className="mb-4 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Single choice questions must have exactly one correct answer.
            Currently {correctAnswersCount} answers are marked as correct.
          </AlertDescription>
        </Alert>
      )}

      {questionType === "multiple-choice" && !multipleChoiceHasCorrect && (
        <Alert className="mb-4 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Multiple choice questions must have at least one correct answer.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
