import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
    <Button
      variant="secondary"
      size="icon"
      className="size-8 active:scale-85"
      {...props}
    >
      {icon}
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: <>{tooltip}</>,
    };
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent {...tooltip} />
    </Tooltip>
  );
}
