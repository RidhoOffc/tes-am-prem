import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-canvas-raised)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">{eyebrow}</p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">{description}</p>}
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}
