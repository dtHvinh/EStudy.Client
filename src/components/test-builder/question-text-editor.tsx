"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useStorageV2 from "@/hooks/use-storage-v2";
import { IconTrash } from "@tabler/icons-react";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import { Question, QuestionUpdateHandler } from "./types";

interface QuestionTextEditorProps {
  question: Question;
  sectionId: string;
  questionId: string;
  onUpdateQuestion: QuestionUpdateHandler;
}

export function QuestionTextEditor({
  question,
  sectionId,
  questionId,
  onUpdateQuestion,
}: QuestionTextEditorProps) {
  const handleQuestionTextChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onUpdateQuestion(sectionId, questionId, "text", e.target.value);
    },
    200,
  );

  return (
    <div className="space-y-4">
      <QuestionAudio
        url={question.audioUrl}
        onAudioChange={(url) =>
          onUpdateQuestion(sectionId, questionId, "audioUrl", url)
        }
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Question Text</Label>
        <Textarea
          spellCheck="false"
          placeholder="Enter your question here..."
          defaultValue={question.text}
          onChange={handleQuestionTextChange}
          className="min-h-[80px] resize-none"
        />
      </div>
    </div>
  );
}

function QuestionAudio({
  url,
  onAudioChange,
}: {
  url?: string;
  onAudioChange: (url: string) => void;
}) {
  const { uploadAudio, removeAudio, getFileUrl } = useStorageV2();

  const handleAudioChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadAudio(file);
      onAudioChange(url);
    }
  };

  const removeAudioFile = () => {
    if (url) {
      removeAudio(url);
      onAudioChange("");
    }
  };

  if (!url) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Question Audio</Label>
        <Input type="file" accept="audio/*" onChange={handleAudioChange} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Question Audio</Label>
      <div className="flex items-center gap-5">
        <audio className="w-full" controls>
          <source src={getFileUrl(url)} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <Button variant={"ghost"} size={"icon"} onClick={removeAudioFile}>
          <IconTrash />
        </Button>
      </div>
    </div>
  );
}
