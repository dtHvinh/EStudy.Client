"use client";

import { useTheme } from "next-themes";
import React, { createContext } from "react";
import { Toaster, ToasterProps } from "sonner";

interface ToasterContextType {
  setPosition: (position: Position) => void;
  config: (settings: ToasterProps & React.RefAttributes<HTMLElement>) => void;
  resetConfig: () => void;
}
type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [position, setPosition] = React.useState<Position>("top-center");
  const [settings, setSettings] = React.useState<
    ToasterProps & React.RefAttributes<HTMLElement>
  >({});

  const resetConfig = () => {
    setSettings({
      position: "top-center",
      richColors: true,
      theme: theme as "light" | "dark" | "system",
    });
  };

  return (
    <ToasterContext.Provider
      value={{ setPosition, config: setSettings, resetConfig }}
    >
      <Toaster
        position={position}
        {...settings}
        theme={theme as "light" | "dark" | "system"}
      />
      {children}
    </ToasterContext.Provider>
  );
}

export function useToaster(): ToasterContextType {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error("useToasterContext must be used within a ToasterProvider");
  }
  return context;
}
