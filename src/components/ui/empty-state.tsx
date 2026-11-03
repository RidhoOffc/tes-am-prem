import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] px-6 py-14 text-center">
      {icon && <div className="text-[var(--color-ink-subtle)]">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-[var(--color-ink-muted)]">{description}</p>
      {action}
    </div>
  );
}
