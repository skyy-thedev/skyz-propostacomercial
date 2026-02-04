"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  error?: string;
  hint?: string;
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      label,
      error,
      hint,
      options,
      value,
      onValueChange,
      disabled,
      required,
      orientation = "vertical",
      className,
    },
    ref
  ) => {
    const groupId = `radio-group-${React.useId()}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-700 mb-3">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <RadioGroupPrimitive.Root
          ref={ref}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          orientation={orientation}
          className={cn(
            orientation === "horizontal"
              ? "flex flex-wrap gap-4"
              : "flex flex-col gap-3",
            className
          )}
          aria-labelledby={label ? groupId : undefined}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-start gap-3">
              <RadioGroupPrimitive.Item
                value={option.value}
                id={`${groupId}-${option.value}`}
                className={cn(
                  "aspect-square h-5 w-5 rounded-full border-2 border-dark-300",
                  "ring-offset-white focus:outline-none focus-visible:ring-2",
                  "focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "transition-all duration-200",
                  "data-[state=checked]:border-primary",
                  "hover:border-primary/60"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
              <div className="flex flex-col">
                <label
                  htmlFor={`${groupId}-${option.value}`}
                  className="text-sm text-dark-700 cursor-pointer select-none leading-tight"
                >
                  {option.label}
                </label>
                {option.description && (
                  <span className="text-xs text-dark-500 mt-0.5">
                    {option.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </RadioGroupPrimitive.Root>
        {error && (
          <p className="mt-2 text-sm text-error flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm text-dark-500">{hint}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
