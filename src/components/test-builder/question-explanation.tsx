"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestionUpdateHandler } from "./types";

interface QuestionExplanationProps {
  explanation?: string;
  sectionId: string;
  questionId: string;
  onUpdateQuestion: QuestionUpdateHandler;
}

export function QuestionExplanation({
  explanation,
  sectionId,
  questionId,
  onUpdateQuestion,
}: QuestionExplanationProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Explanation (Optional)</Label>
      <Textarea
        spellCheck="false"
        placeholder="Explain why the correct answer(s) are correct. This will be shown to students after submission."
        value={explanation || ""}
        onChange={(e) =>
          onUpdateQuestion(sectionId, questionId, "explanation", e.target.value)
        }
        className="resize-none"
      />
    </div>
  );
}
