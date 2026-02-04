"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      placeholder = "Selecione uma opção",
      options,
      value,
      onValueChange,
      disabled,
      required,
      className,
      id,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-dark-700 mb-2"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <SelectPrimitive.Root
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={selectId}
            className={cn(
              "flex w-full items-center justify-between px-4 py-3 rounded-xl border",
              "bg-white/50 backdrop-blur-sm text-dark-800",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-all duration-200",
              "hover:border-dark-300 hover:bg-white/70",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-dark-50",
              "data-[placeholder]:text-dark-400",
              error
                ? "border-error focus:ring-error/20 focus:border-error"
                : "border-dark-200",
              className
            )}
            aria-invalid={!!error}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="h-4 w-4 text-dark-400" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
                "rounded-xl border border-dark-200 bg-white shadow-xl",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2",
                "data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2",
                "data-[side=top]:slide-in-from-bottom-2"
              )}
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.Viewport className="p-1.5">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center",
                      "rounded-lg py-2.5 px-3 text-sm text-dark-700 outline-none",
                      "focus:bg-primary/5 focus:text-primary",
                      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                      "data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                      <Check className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        
        {error && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-dark-500">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
