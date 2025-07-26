"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface AddCardContextType {
  initialTerm: string;
  setInitialTerm: (term: string) => void;
  clearInitialTerm: () => void;
}

const AddCardContext = createContext<AddCardContextType | undefined>(undefined);

interface AddCardProviderProps {
  children: ReactNode;
}

export function AddCardProvider({ children }: AddCardProviderProps) {
  const [initialTerm, setInitialTermState] = useState<string>("");

  const setInitialTerm = (term: string) => {
    setInitialTermState(term);
  };

  const clearInitialTerm = () => {
    setInitialTermState("");
  };

  const value: AddCardContextType = {
    initialTerm,
    setInitialTerm,
    clearInitialTerm,
  };

  return (
    <AddCardContext.Provider value={value}>{children}</AddCardContext.Provider>
  );
}

export function useAddCard() {
  const context = useContext(AddCardContext);
  if (context === undefined) {
    throw new Error("useAddCard must be used within an AddCardProvider");
  }
  return context;
}
