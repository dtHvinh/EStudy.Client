"use client";

import {
  CreateFlashCardRequestType,
  useCreateCardAction,
} from "@/hooks/use-set-cards";
import useMyFlashCardSet from "@/hooks/useMyFlashCardSet";
import { createContext, ReactNode, useContext, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import AddCardForm from "../add-card-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface AddCardContextType {
  initialTerm: string;
  setInitialTerm: (term: string) => void;
  clearInitialTerm: () => void;
  onOpenChange: (open: boolean) => void;
}

const AddCardContext = createContext<AddCardContextType | undefined>(undefined);

interface AddCardProviderProps {
  children: ReactNode;
}

export function AddCardProvider({ children }: AddCardProviderProps) {
  const [initialTerm, setInitialTermState] = useState<string>("");
  const [collectionId, setCollectionId] = useState<string>("");
  const [opened, setOpen] = useState<boolean>(false);
  const setInitialTerm = (term: string) => {
    setInitialTermState(term);
  };
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { createCard } = useCreateCardAction(collectionId);

  const handleCreateCard = async (
    data: CreateFlashCardRequestType,
    form: UseFormReturn<CreateFlashCardRequestType>,
  ) => {
    const result = await createCard(data, form);
    setOpen(false);
    setTabIndex(0);
    return result;
  };

  const handleCollectionSelect = (collectionId: string | number) => {
    setCollectionId(collectionId.toString());
    setTabIndex(1);
  };

  const clearInitialTerm = () => {
    setInitialTermState("");
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setTabIndex(0);
      clearInitialTerm();
      setCollectionId("");
    }
  };

  const value: AddCardContextType = {
    initialTerm,
    setInitialTerm,
    clearInitialTerm,
    onOpenChange,
  };

  return (
    <AddCardContext.Provider value={value}>
      {children}
      {tabIndex === 0 && (
        <CollectionSelector
          opened={opened}
          onOpenChange={onOpenChange}
          onSelect={handleCollectionSelect}
        />
      )}
      {tabIndex === 1 && (
        <>
          <AddCardForm
            initialTerm={initialTerm}
            modal={false}
            opened={opened}
            onOpenChange={onOpenChange}
            trigger={null}
            onSubmit={handleCreateCard}
          />
        </>
      )}
    </AddCardContext.Provider>
  );
}

export function useAddCard() {
  const context = useContext(AddCardContext);
  if (context === undefined) {
    throw new Error("useAddCard must be used within an AddCardProvider");
  }
  return context;
}

const CollectionSelector = ({
  opened,
  onOpenChange,
  onSelect,
}: {
  opened: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (collectionId: string | number) => void;
}) => {
  const { sets, scrollNext, refresh } = useMyFlashCardSet({
    pageSize: 20,
    page: 1,
  });
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        scrollNext();
      }
    },
  });

  return (
    <Dialog open={opened} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Collection</DialogTitle>
          <DialogDescription>
            Select a collection to add your card to
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] px-4">
          {sets.map((set) => (
            <Button
              key={set.id}
              onClick={() => onSelect?.(set.id)}
              variant="ghost"
              className="w-full text-left"
            >
              {set.title}
            </Button>
          ))}
          <div className="mt-4 flex w-full justify-center [&_*]:w-full"></div>
          <div ref={ref} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
