import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-[var(--radius-md)] border bg-[var(--color-canvas-raised)] px-3.5 text-sm outline-none transition-colors placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20",
        error ? "border-[var(--color-danger)]" : "border-[var(--color-border-strong)]",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
