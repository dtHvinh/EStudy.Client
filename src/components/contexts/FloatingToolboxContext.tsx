"use client";

import { createContext, useContext, useState } from "react";
import FloatingToolbox from "../floating-toolbox/floating-toolbox";

export interface ToolProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingToolboxContextType {
  addTool: (tools: ToolProps[]) => void;
}

const FloatingToolboxContext = createContext<
  FloatingToolboxContextType | undefined
>(undefined);

const FloatingToolboxProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [tools, setTools] = useState<ToolProps[]>([]);

  const addTool = (tools: ToolProps[]) => {
    setTools((prevTools) => [...prevTools, ...tools]);
  };

  return (
    <FloatingToolboxContext.Provider
      value={{
        addTool,
      }}
    >
      <FloatingToolbox additionalTools={tools} />
      {children}
    </FloatingToolboxContext.Provider>
  );
};

export function useFloatingToolbox(): FloatingToolboxContextType {
  const context = useContext(FloatingToolboxContext);
  if (!context) {
    throw new Error(
      "useFloatingToolbox must be used within a FloatingToolboxContext",
    );
  }
  return context;
}

export default FloatingToolboxProvider;
