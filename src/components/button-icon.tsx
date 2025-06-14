import { HTMLAttributeAnchorTarget } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ButtonIcon({
  className,
  icon,
  tooltip,
  href,
  target,
  asChild,
  ...props
}: {
  icon: React.ReactNode;
  text?: string;
  href?: string;
  asChild?: boolean;
  target?: HTMLAttributeAnchorTarget;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & React.ComponentProps<"button">) {
  const Comp = asChild ? "span" : Button;

  const button = (
    <Comp
      variant="secondary"
      size="icon"
      className="size-8 active:scale-85"
      {...props}
      asChild={!!href}
    >
      {href ? (
        <a
          href={href}
          target={target}
          className="flex items-center justify-center"
          rel="noopener noreferrer"
        >
          {icon}
        </a>
      ) : (
        <span className="flex items-center justify-center">{icon}</span>
      )}
    </Comp>
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
