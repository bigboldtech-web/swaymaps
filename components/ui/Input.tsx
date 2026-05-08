"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-8 w-full rounded-sm border border-border bg-panel px-2.5 text-sm text-fg placeholder:text-fg-subtle",
          "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          error && "border-danger focus:border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
    );

    if (!label && !error) return input;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-fg-muted">{label}</label>
        )}
        {input}
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[64px] w-full rounded-sm border border-border bg-panel px-2.5 py-2 text-sm text-fg placeholder:text-fg-subtle",
        "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors resize-y",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-medium text-fg-muted leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";
