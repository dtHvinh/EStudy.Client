import { useAddCard } from "@/components/contexts/AddCardContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconNote } from "@tabler/icons-react";
import { useEditor } from "novel";
import { useEffect } from "react";

export default function FlashCardSaveButton() {
  const { editor } = useEditor();
  const { setInitialTerm, initialTerm, clearInitialTerm, onOpenChange } =
    useAddCard();

  const shouldRender = editor && initialTerm.indexOf(" ") === -1;

  useEffect(() => {
    const handleSelectionUpdate = () => {
      if (!editor) return;
      const startI = editor.state.selection.from;
      const endI = editor.state.selection.to;

      const selectedText = editor.state.doc
        .textBetween(startI, endI, " ")
        .trim()
        .replace(/[^a-zA-Z ]/g, ""); // Remove non-alphabetic characters

      setInitialTerm(selectedText);
    };

    if (editor) {
      editor.on("selectionUpdate", handleSelectionUpdate);
    }

    return () => {
      if (editor) {
        editor.off("selectionUpdate", handleSelectionUpdate);
      }
      clearInitialTerm();
    };
  }, [editor]);

  return (
    shouldRender && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => onOpenChange(true)}
            size={"icon"}
            variant="ghost"
          >
            <IconNote />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Save as flash card</span>
        </TooltipContent>
      </Tooltip>
    )
  );
}
