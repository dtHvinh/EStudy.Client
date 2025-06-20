"use client";

import MainLayout from "@/components/layouts/MainLayout";
import TailwindEditor from "@/components/text-editor/text-editor";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";

export default function Page() {
  const [content, setContent] = useState<JSONContent>();
  const [title, setTitle] = useState<string>("");

  const getTitle = (json: JSONContent | undefined) => {
    if (!json || !json.content) return "untitled";
    if (json.content.length > 0) {
      const firstNode = json.content[0];
      if (firstNode.type === "heading" && firstNode.attrs?.level === 1) {
        return firstNode.content?.[0]?.text || "untitled";
      }
    }
    return "untitled";
  };

  useEffect(() => {
    setTitle(getTitle(content));
  }, [content]);

  return (
    <MainLayout>
      <div spellCheck={false} className="pb-9">
        <TailwindEditor autoFocus onUpdate={setContent} />
      </div>
    </MainLayout>
  );
}
