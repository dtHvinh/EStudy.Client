import * as React from "react";

import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";
import ButtonIcon from "../button-icon";

interface InputProps extends React.ComponentProps<"input"> {
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, clearable = true, onClear, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      props.defaultValue || ""
    );
    const isControlled = props.value !== undefined;
    const inputValue = isControlled ? props.value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      props.onChange?.(e);
    };

    const handleClear = () => {
      if (isControlled) {
        // For controlled inputs, call the onClear prop or create a synthetic event
        if (onClear) {
          onClear();
        } else if (props.onChange) {
          const syntheticEvent = {
            target: { value: "" },
            currentTarget: { value: "" },
          } as React.ChangeEvent<HTMLInputElement>;
          props.onChange(syntheticEvent);
        }
      } else {
        // For uncontrolled inputs, update internal state
        setInternalValue("");
        if (onClear) {
          onClear();
        }
      }
    };

    const shouldShowClearButton =
      clearable && inputValue && String(inputValue).length > 0;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            shouldShowClearButton && "pr-10", // Add padding for the clear button
            className
          )}
          {...props}
          value={inputValue}
          onChange={handleChange}
        />
        {shouldShowClearButton && (
          <ButtonIcon
            icon={<IconX />}
            tooltip={"Clear input"}
            className="absolute border-0 right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-muted rounded-sm"
            onClick={handleClear}
            type="button"
            tabIndex={-1}
          />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
