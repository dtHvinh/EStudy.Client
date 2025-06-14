import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { HTMLAttributeAnchorTarget } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ButtonIcon({
  className,
  icon,
  tooltip,
  target,
  asChild,
  variant,
  ...props
}: {
  icon: React.ReactNode;
  text?: string;
  asChild?: boolean;
  target?: HTMLAttributeAnchorTarget;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? "span" : Button;

  const button = (
    <Comp
      variant="secondary"
      size="icon"
      className={cn(
        buttonVariants({ variant, className }),
        "size-8 active:scale-85"
      )}
      {...props}
    >
      {icon}
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
