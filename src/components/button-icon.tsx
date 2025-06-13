import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Button } from "./ui/button";

export default function ButtonIcon({
  className,
  children,
  icon,
  tooltip,
  ...props
}: {
  icon: React.ReactNode;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & React.ComponentProps<"button">) {
  const button = (
    <Button variant="secondary" size="icon" className="size-8" {...props}>
      {icon}
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={false} {...tooltip} />
    </Tooltip>
  );
}
