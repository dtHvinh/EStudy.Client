import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  TextIcon,
  TextQuote,
  type LucideIcon,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@radix-ui/react-popover";

export type SelectorItem = {
  name: string;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>["editor"]) => void;
  isActive: (editor: ReturnType<typeof useEditor>["editor"]) => boolean;
};

const items: SelectorItem[] = [
  {
    name: "Text",
    icon: TextIcon,
    command: (editor) =>
      editor!.chain().focus().toggleNode("paragraph", "paragraph").run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor!.isActive("paragraph") &&
      !editor!.isActive("bulletList") &&
      !editor!.isActive("orderedList"),
  },
  {
    name: "Heading 1",
    icon: Heading1,
    command: (editor) =>
      editor!.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor!.isActive("heading", { level: 1 }),
  },
  {
    name: "Heading 2",
    icon: Heading2,
    command: (editor) =>
      editor!.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor!.isActive("heading", { level: 2 }),
  },
  {
    name: "Heading 3",
    icon: Heading3,
    command: (editor) =>
      editor!.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor!.isActive("heading", { level: 3 }),
  },
  {
    name: "To-do List",
    icon: CheckSquare,
    command: (editor) => editor!.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor!.isActive("taskItem"),
  },
  {
    name: "Bullet List",
    icon: ListOrdered,
    command: (editor) => editor!.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor!.isActive("bulletList"),
  },
  {
    name: "Numbered List",
    icon: ListOrdered,
    command: (editor) => editor!.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor!.isActive("orderedList"),
  },
  {
    name: "Quote",
    icon: TextQuote,
    command: (editor) =>
      editor!
        .chain()
        .focus()
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
    isActive: (editor) => editor!.isActive("blockquote"),
  },
  {
    name: "Code",
    icon: Code,
    command: (editor) => editor!.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor!.isActive("codeBlock"),
  },
];
interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="gap-2 rounded-none border-none hover:bg-accent focus:ring-0"
      >
        <Button variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item, index) => (
          <EditorBubbleItem
            key={index}
            onSelect={(editor) => {
              item.command(editor);
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">
                <item.icon className="h-3 w-3" />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <Check className="h-4 w-4" />}
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
