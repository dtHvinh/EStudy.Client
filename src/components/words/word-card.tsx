import useWordDefinition from "@/hooks/use-word-definition";
import { useState } from "react";
import { Button } from "../ui/button";
import { WordDefinitionDialog } from "../word-definition-dialog";

interface Word {
  id: number | string;
  text: string;
}

interface WordCardProps {
  word: Word;
  searchQuery: string;
}

export default function WordCard({ word, searchQuery }: WordCardProps) {
  const { definition, fetchDefinition } = useWordDefinition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = async (term: string) => {
    setIsLoading(true);
    setIsDialogOpen(true);
    try {
      await fetchDefinition(term);
    } catch (error) {
      console.error("Failed to fetch definition:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-primary/20 text-primary rounded px-0.5 font-medium"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <>
      <Button
        variant={"ghost"}
        className="w-full p-6"
        onClick={() => open(word.text)}
      >
        <div className=""></div>
        <div className="relative">
          <p className="w-full text-left font-medium break-words">
            {highlightText(word.text, searchQuery)}
          </p>
        </div>
      </Button>
      <WordDefinitionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        definition={definition}
        loading={isLoading}
      />
    </>
  );
}
