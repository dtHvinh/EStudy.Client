import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { ButtonVariant } from "./utils/types";

export const SelectToggle = ({
  variant = "outline",
  ...props
}: { variant?: ButtonVariant } & React.ComponentProps<typeof Checkbox>) => {
  return (
    <div
      className={cn("flex items-center", buttonVariants({ variant: variant }))}
    >
      <Checkbox
        checked={props.checked}
        onCheckedChange={props.onCheckedChange}
      />
      <Label className="text-sm" htmlFor="select-toggle">
        {props.children}
      </Label>
    </div>
  );
};
