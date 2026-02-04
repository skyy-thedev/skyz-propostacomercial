import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-700 mb-2"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm",
              "placeholder:text-dark-400 text-dark-800",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-all duration-200",
              "hover:border-dark-300 hover:bg-white/70",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-dark-50",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-error focus:ring-error/20 focus:border-error"
                : "border-dark-200",
              className
            )}
            ref={ref}
            {...(error && { "aria-invalid": true, "aria-describedby": `${inputId}-error` })}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-dark-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-error flex items-center gap-1.5"
          >
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

Input.displayName = "Input";

export { Input };
