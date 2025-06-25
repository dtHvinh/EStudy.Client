import { EditorContent, EditorRoot, JSONContent } from "novel";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { defaultExtensions } from "./text-editor/default-extensions";
import { slashCommand } from "./text-editor/slash-commands";

export default function HTMLContent({ content }: { content: string }) {
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
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        editable={false}
      ></EditorContent>
    </EditorRoot>
  );
}
