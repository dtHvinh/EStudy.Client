"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Bell,
  GripVertical,
  Home,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { playSound } from "./utils/utilss";

interface Position {
  x: number;
  y: number;
}

interface FloatingToolboxProps {
  showDefaultTools?: boolean; // Whether to show default tools when no context tools are available
}

const defaultTools = [
  {
    icon: <Home className="w-4 h-4" />,
    label: "Home",
    onClick: () => console.log("Home clicked"),
  },
  {
    icon: <Search className="w-4 h-4" />,
    label: "Search",
    onClick: () => console.log("Search clicked"),
  },
  {
    icon: <Bell className="w-4 h-4" />,
    label: "Notifications",
    onClick: () =>
      playSound(
        "https://cawaeyecbhhlteogiasw.supabase.co/storage/v1/object/public/estudy/sounds/noti1.wav"
      ),
  },
  {
    icon: <User className="w-4 h-4" />,
    label: "Profile",
    onClick: () => console.log("Profile clicked"),
  },
  {
    icon: <Settings className="w-4 h-4" />,
    label: "Settings",
    onClick: () => console.log("Settings clicked"),
  },
];

export default function FloatingToolbox({ tools }: FloatingToolboxProps) {
  const [position, setPosition] = useState<Position>({ x: 20, y: 100 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
  const toolboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    updateConstraints();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateConstraints);
      return () => window.removeEventListener("resize", updateConstraints);
    }
  }, [isCollapsed]); // Re-calculate when collapsed state changes

  const toolsToRender = tools || defaultTools;

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
        className={`bg-white/95 backdrop-blur-sm border shadow-lg transition-all duration-200 w-12 py-0 ${
          isCollapsed ? "" : "hover:shadow-lg"
        }`}
      >
        <div className="p-2 touch-none">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 p-0 mb-1"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <Plus className="w-4 h-4" />
            ) : (
              <GripVertical className="w-4 h-4" />
            )}
          </Button>

          <motion.div
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: { opacity: 1, height: "auto" },
            }}
            initial="hidden"
            animate={isCollapsed ? "hidden" : "visible"}
            className="space-y-1"
          >
            {toolsToRender.map((tool, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full h-8 p-0"
                onClick={tool.onClick}
              >
                {tool.icon}
              </Button>
            ))}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
