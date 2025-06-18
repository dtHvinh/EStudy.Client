"use client";

import { createContext } from "react";
import FloatingToolbox from "../floating-toolbox";

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
  return (
    <FloatingToolboxContext.Provider
      value={{
        addTool: (tools: ToolProps[]) => {
          // Logic to add tools dynamically can be implemented here
          console.log("Tools added:", tools);
        },
      }}
    >
      <FloatingToolbox />
      {children}
    </FloatingToolboxContext.Provider>
  );
};

export default FloatingToolboxProvider;
