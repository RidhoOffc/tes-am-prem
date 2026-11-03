import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-[var(--color-border)] text-[var(--color-ink-muted)]",
        success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
        warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
        danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
        accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export function StatusDot({ tone }: { tone: "success" | "warning" | "danger" | "neutral" }) {
  const colorMap: Record<string, string> = {
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    danger: "bg-[var(--color-danger)]",
    neutral: "bg-[var(--color-ink-subtle)]",
  };
  return <span className={cn("h-2 w-2 shrink-0 rounded-full", colorMap[tone])} aria-hidden="true" />;
}
