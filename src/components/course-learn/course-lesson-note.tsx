import { GetCourseToLearnLessonResponse } from "@/hooks/use-learn-course";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";

export default function CourseLessonNote({
  lesson,
  onNoteSaved,
}: {
  lesson: GetCourseToLearnLessonResponse;
  onNoteSaved?: (lessonId: number, content: string) => void;
}) {
  const [note, setNote] = useState(lesson.note?.content || "");
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (note.trim() && onNoteSaved) {
      onNoteSaved(lesson.id, note);
      setIsDirty(false);
    }
  };

  useEffect(() => {
    textareaRef.current?.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "s") {
        handleSave();
        e.preventDefault();
      }
    });
  }, []);

  useEffect(() => {
    setNote(lesson.note?.content || "");
  }, [lesson]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between border-b">
          My Notes
          <Button
            variant={"ghost"}
            className="mt-4"
            onClick={handleSave}
            disabled={!isDirty}
          >
            <IconDeviceFloppy /> Save
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          ref={textareaRef}
          placeholder="Add your notes for this course..."
          spellCheck={false}
          className="foucs:border-none min-h-[200px] resize-none border-none focus-visible:ring-0"
          onChange={(e) => {
            setNote(e.target.value);
            setIsDirty(true);
          }}
          value={note}
        />
      </CardContent>
    </Card>
  );
}
