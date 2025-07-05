"use client";

import { useGenericToggle } from "@/hooks/use-generic-toggle";
import { cn } from "@/lib/utils";
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
  className,
}: {
  initialContent?: JSONContent | string;
  autoFocus?: boolean;
  onContentUpdate?: (jsonContent: JSONContent, htmlContent: string) => void;
  className?: string;
}) => {
  const { opened: openNode, openChange: setOpenNode } = useGenericToggle(false);
  const { opened: openLink, openChange: setOpenLink } = useGenericToggle(false);
  const debouncedUpdates = useDebouncedCallback(
    async ({ editor }: { editor: EditorInstance; transaction: any }) => {
      onContentUpdate?.(editor.getJSON(), editor.getHTML());
    },
    1000,
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
            class: `${cn("prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full", className)}`,
            spellcheck: "false",
          },
        }}
      >
        <EditorBubble className="bg-background flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 shadow-xl">
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
        </EditorBubble>
        <EditorCommand className="border-muted bg-background z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="text-muted-foreground px-2">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`hover:bg-accent aria-selected:bg-accent flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm`}
                key={item.title}
              >
                <div className="border-muted bg-background flex h-10 w-10 items-center justify-center rounded-md border">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground text-xs">
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
