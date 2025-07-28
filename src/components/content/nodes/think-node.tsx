import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const ThinkNode = Node.create({
  name: "think",
  group: "block",
  content: "inline*",
  atom: false,

  addAttributes() {
    return {
      class: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "think" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["think", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ThinkComponent);
  },
});

interface ThinkProps {
  node: { attrs: { class?: string } };
}

export function ThinkComponent({ node }: ThinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <NodeViewWrapper className={`think-node ${node.attrs.class} `}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex cursor-pointer items-center space-x-2">
          <CollapsibleTrigger asChild>
            <button className="flex items-center space-x-1">
              {open ? <ChevronDown /> : <ChevronRight />}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Thought
              </span>
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-2">
          <div className="text-muted-foreground/80 px-4">
            <NodeViewContent />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </NodeViewWrapper>
  );
}
