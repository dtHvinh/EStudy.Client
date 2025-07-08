import { useCreateCourseStructure } from "@/hooks/use-create-course-structure";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import { Input } from "../ui/input";

const ChapterTitle = ({ chapterIndex }: { chapterIndex: number }) => {
  const [isEditing, setIsEditing] = useState(false);
  const d = useDebouncedCallback((e) => {
    updateChapter(chapterIndex, {
      title: e.target.value,
    });
  }, 500);

  const { updateChapter, getChapterTitle } = useCreateCourseStructure(
    useShallow((state) => ({
      updateChapter: state.updateChapter,
      getChapterTitle: state.getChapterTitle,
    })),
  );
  return isEditing && getChapterTitle ? (
    <Input
      spellCheck="false"
      defaultValue={getChapterTitle(chapterIndex) || ""}
      onChange={d}
      onBlur={() => setIsEditing(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter") setIsEditing(false);
      }}
      className="h-8 text-sm font-medium"
      autoFocus
    />
  ) : (
    <button
      onClick={() => setIsEditing(true)}
      className="hover:text-primary w-full truncate text-left text-sm font-medium transition-colors"
    >
      {getChapterTitle(chapterIndex) || `Chapter ${chapterIndex + 1}`}
    </button>
  );
};

export default ChapterTitle;
