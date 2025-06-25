"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMobile } from "@/hooks/use-mobile";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ToolProps } from "../contexts/FloatingToolboxContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Position {
  x: number;
  y: number;
}

const defaultTools: ToolProps[] = [
  {
    icon: <IconArrowUp className="w-4 h-4" />,
    label: "To top",
    onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    icon: <IconArrowDown className="w-4 h-4" />,
    label: "To bottom",
    onClick: () =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
  },
];

export default function FloatingToolbox({
  additionalTools,
}: {
  additionalTools?: ToolProps[];
}) {
  const isMobile = useMobile();

  const [position, setPosition] = useState<Position>({ x: 20, y: 300 });
  const [isClient, setIsClient] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
  const toolboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        const margin = 20;
        const toolboxWidth = toolboxRef.current?.offsetWidth || 60;
        const toolboxHeight = toolboxRef.current?.offsetHeight || 300;

        setDragConstraints({
          left: margin,
          top: margin,
          right: window.innerWidth - toolboxWidth - margin,
          bottom: window.innerHeight - toolboxHeight - margin,
        });
      }
    };

    const updatePosition = () => {
      if (typeof window !== "undefined" && toolboxRef.current) {
        const margin = 20;
        const toolboxWidth = toolboxRef.current.offsetWidth;
        const toolboxHeight = toolboxRef.current.offsetHeight;

        setPosition({
          x: window.innerWidth - toolboxWidth - margin,
          y: window.innerHeight - toolboxHeight - margin,
        });
      }
    };

    updateConstraints();
    updatePosition();

    if (typeof window !== "undefined") {
      const handleResize = () => {
        updateConstraints();
        updatePosition();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isClient]);

  if (isMobile) {
    return <></>;
  }

  const toolsToRender = defaultTools.concat(additionalTools || []);

  const clampPosition = (x: number, y: number): Position => {
    if (typeof window === "undefined") return { x, y };

    const margin = 20;
    const toolboxWidth = toolboxRef.current?.offsetWidth || 60;
    const toolboxHeight = toolboxRef.current?.offsetHeight || 300;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const clampedX = Math.max(
      margin,
      Math.min(x, screenWidth - toolboxWidth - margin)
    );
    const clampedY = Math.max(
      margin,
      Math.min(y, screenHeight - toolboxHeight - margin)
    );

    return { x: clampedX, y: clampedY };
  };

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={dragConstraints}
        dragElastic={0.15}
        onDragEnd={(event, info) => {
          const final = clampPosition(info.point.x, info.point.y);
          setPosition(final);
        }}
        style={{ x: position.x, y: position.y }}
        ref={toolboxRef}
        className="fixed z-50 cursor-grab"
      >
        <Card
          className={`bg-card backdrop-blur-sm border shadow-lg transition-all duration-200 w-12 py-0`}
        >
          <div className="p-2 touch-none">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 p-0 hover:bg-blue-50 transition-colors cursor-grab"
                title="Focus Timer"
              >
                <GripVertical className="w-4 h-4" />
              </Button>
              {toolsToRender.map((tool, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 p-0"
                      onClick={tool.onClick}
                    >
                      {tool.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="w-max">
                    {tool.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
