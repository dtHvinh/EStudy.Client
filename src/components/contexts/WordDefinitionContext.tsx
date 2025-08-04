import { WordDefinitionDialog } from "@/components/word-definition-dialog";
import useWordDefinition from "@/hooks/use-word-definition";
import { createContext, useContext, useState } from "react";

interface WordDefinitionContextType {
  open: (term: string) => Promise<void>;
}

const WordDefinitionContext = createContext<
  WordDefinitionContextType | undefined
>(undefined);

export function useWordDefinitionContext() {
  const context = useContext(WordDefinitionContext);
  if (context === undefined) {
    throw new Error(
      "useWordDefinitionContext must be used within a WordDefinitionContextProvider",
    );
  }
  return context;
}

export default function WordDefinitionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <WordDefinitionContext.Provider value={{ open }}>
      {children}
      <WordDefinitionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        definition={definition}
        loading={isLoading}
      />
    </WordDefinitionContext.Provider>
  );
}

export function useWordDefinitionDialog() {
  return useWordDefinitionContext();
}
