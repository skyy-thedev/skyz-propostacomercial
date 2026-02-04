import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      charCount = false,
      maxLength,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || `textarea-${generatedId}`;
    const currentLength = typeof value === "string" ? value.length : 0;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-dark-700 mb-2"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm",
              "placeholder:text-dark-400 text-dark-800",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-all duration-200 resize-none",
              "hover:border-dark-300 hover:bg-white/70",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-dark-50",
              "min-h-[120px]",
              error
                ? "border-error focus:ring-error/20 focus:border-error"
                : "border-dark-200",
              className
            )}
            ref={ref}
            {...(error && { "aria-invalid": true, "aria-describedby": `${textareaId}-error` })}
            {...props}
          />
        </div>
        <div className="flex justify-between items-start mt-1.5">
          <div>
            {error && (
              <p
                id={`${textareaId}-error`}
                className="text-sm text-error flex items-center gap-1.5"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            {hint && !error && (
              <p className="text-sm text-dark-500">{hint}</p>
            )}
          </div>
          {charCount && maxLength && (
            <span
              className={cn(
                "text-xs",
                currentLength > maxLength * 0.9
                  ? "text-warning"
                  : "text-dark-400"
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
