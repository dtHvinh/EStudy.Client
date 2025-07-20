import { useGenericToggle } from "@/hooks/use-generic-toggle";
import { EditorContent, EditorRoot, JSONContent } from "novel";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { defaultExtensions } from "./text-editor/default-extensions";
import { slashCommand } from "./text-editor/slash-commands";

export default function HTMLContent({ content }: { content: string }) {
  const { opened: openNode, openChange: setOpenNode } = useGenericToggle(false);
  const { opened: openLink, openChange: setOpenLink } = useGenericToggle(false);
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
            class: `prose just-text prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        editable={false}
      >
        {/* <EditorBubble
          shouldShow={({ editor, from, to }) => {
            return from !== to && !editor.isEmpty;
          }}
          className="bg-background flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 shadow-xl"
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons /> 
        </EditorBubble> */}
      </EditorContent>
    </EditorRoot>
  );
}
