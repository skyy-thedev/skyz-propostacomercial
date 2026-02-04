"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ label, checked, onCheckedChange, disabled, className, id }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || `checkbox-${generatedId}`;

  return (
    <div className="flex items-start gap-3">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded-md border-2 border-dark-300",
          "ring-offset-white focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary/50 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
          "data-[state=checked]:text-white",
          "hover:border-primary/60",
          className
        )}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        htmlFor={checkboxId}
        className={cn(
          "text-sm text-dark-700 cursor-pointer select-none leading-tight",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        )}
      >
        {label}
      </label>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
