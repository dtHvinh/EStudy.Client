"use client";

import { useGenericToggle } from "@/hooks/use-generic-toggle";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  GlobalDragHandle,
  handleCommandNavigation,
  JSONContent,
} from "novel";
import AutoJoiner from "tiptap-extension-auto-joiner";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./default-extensions";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-commands";

const TailwindEditor = ({
  initialContent,
  autoFocus,
  onContentUpdate,
}: {
  initialContent?: JSONContent | string;
  autoFocus?: boolean;
  onContentUpdate?: (jsonContent: JSONContent, htmlContent: string) => void;
}) => {
  const { opened: openNode, openChange: setOpenNode } = useGenericToggle(false);
  const { opened: openLink, openChange: setOpenLink } = useGenericToggle(false);
  const debouncedUpdates = useDebouncedCallback(
    async ({ editor }: { editor: EditorInstance; transaction: any }) => {
      onContentUpdate?.(editor.getJSON(), editor.getHTML());
    },
    1000
  );

  return (
    <EditorRoot>
      <EditorContent
        autofocus={autoFocus}
        extensions={[
          ...defaultExtensions,
          slashCommand,
          GlobalDragHandle,
          AutoJoiner,
        ]}
        initialContent={initialContent as JSONContent}
        onUpdate={debouncedUpdates}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
      >
        <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 bg-background shadow-xl">
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
        </EditorBubble>
        <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
};
export default TailwindEditor;
