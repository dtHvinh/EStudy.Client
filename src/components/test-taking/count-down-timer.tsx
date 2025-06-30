import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Clock } from "lucide-react";

export type WarningLevel = "normal" | "warning" | "critical";

interface CountdownTimerProps {
  timeLeft: number;
  formatTime: string;
  warningLevel: WarningLevel;
  isTimeUp: boolean;
}

export function CountdownTimer({
  timeLeft,
  formatTime,
  warningLevel,
  isTimeUp,
}: CountdownTimerProps) {
  const getTimerStyles = () => {
    switch (warningLevel) {
      case "critical":
        return "border-destructive bg-destructive/10 text-destructive";
      case "warning":
        return "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300";
      default:
        return "border-primary bg-primary/5 text-primary";
    }
  };

  const getIcon = () => {
    switch (warningLevel) {
      case "critical":
        return <AlertCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <Card
      className={cn("border-2 transition-all duration-300", getTimerStyles())}
    >
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-sm font-medium">
              {isTimeUp ? "Time Up!" : "Time Remaining"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-2xl font-bold",
                warningLevel === "critical" && "animate-pulse",
              )}
            >
              {formatTime}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
