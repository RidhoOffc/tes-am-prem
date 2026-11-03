import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "~/components/ui/icons";
import { cn } from "~/lib/utils";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  trigger?: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-up" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-canvas-raised)] p-6 shadow-xl",
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm text-[var(--color-ink-muted)]">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className="rounded-full p-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-border)]">
              <X className="h-4 w-4" />
              <span className="sr-only">Tutup</span>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
