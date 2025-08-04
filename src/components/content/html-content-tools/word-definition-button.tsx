import { useWordDefinitionContext } from "@/components/contexts/WordDefinitionContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconBook2 } from "@tabler/icons-react";
import { useEditor } from "novel";
import { useEffect, useState } from "react";

export default function WordDefinitionButton() {
  const { open } = useWordDefinitionContext();
  const { editor } = useEditor();
  const [currentTerm, setCurrentTerm] = useState<string>();

  useEffect(() => {
    const handleSelectionUpdate = () => {
      if (!editor) return;
      const startI = editor.state.selection.from;
      const endI = editor.state.selection.to;

      const selectedText = editor.state.doc
        .textBetween(startI, endI, " ")
        .trim()
        .replace(/[^a-zA-Z ]/g, ""); // Remove non-alphabetic characters

      setCurrentTerm(selectedText);
    };

    if (editor) {
      editor.on("selectionUpdate", handleSelectionUpdate);
    }

    return () => {
      if (editor) {
        editor.off("selectionUpdate", handleSelectionUpdate);
      }
      setCurrentTerm("");
    };
  }, [editor]);

  const handleClick = async () => {
    if (currentTerm) {
      await open(currentTerm);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={handleClick} size={"icon"} variant="ghost">
          <IconBook2 />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Dictionary</span>
      </TooltipContent>
    </Tooltip>
  );
}
