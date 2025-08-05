import { cn } from "@/lib/utils";
import {
  EditorBubble,
  EditorContent,
  EditorRoot,
  JSONContent,
  useEditor,
} from "novel";
import { useEffect } from "react";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { defaultExtensions } from "../text-editor/default-extensions";
import { slashCommand } from "../text-editor/slash-commands";
import FlashCardSaveButton from "./html-content-tools/flash-card-save-button";
import WordDefinitionButton from "./html-content-tools/word-definition-button";

export default function HTMLContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <EditorRoot>
      <EditorContent
        extensions={[
          ...defaultExtensions,
          slashCommand,
          GlobalDragHandle,
          AutoJoiner,
        ]}
        initialContent={content as unknown as JSONContent}
        editorProps={{
          attributes: {
            "data-prose-no-padding": "true",
            class: cn(
              `prose just-text prose-lg dark:prose-invert  prose-headings:font-title font-default focus:outline-none max-w-full`,
              className,
            ),
          },
        }}
        editable={false}
      >
        <StreamContentUpdator content={content} />
        <EditorBubble
          tippyOptions={{
            // Ensure the bubble is on top of these global form like add card form
            zIndex: 10,
          }}
          shouldShow={({ editor, from, to }) => {
            return from !== to && !editor.isEmpty;
          }}
          className="bg-background flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 shadow-xl invert"
        >
          <FlashCardSaveButton />
          <WordDefinitionButton />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
}

const StreamContentUpdator = ({ content }: { content: string }) => {
  const { editor } = useEditor();
  useEffect(() => {
    editor?.commands.setContent(content, false);
  }, [content]);
  return null;
};
