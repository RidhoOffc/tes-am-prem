import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "~/lib/utils";
import { Check, AlertTriangle, X } from "~/components/ui/icons";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: "success" | "error" | "info";
}

interface ToastContextValue {
  push: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${counter.current++}`;
    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            onOpenChange={(open) => !open && remove(toast.id)}
            className={cn(
              "flex items-start gap-3 rounded-[var(--radius-md)] border p-4 shadow-lg data-[state=open]:animate-fade-up",
              toast.tone === "success" && "border-[var(--color-success)]/30 bg-[var(--color-success-soft)]",
              toast.tone === "error" && "border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)]",
              toast.tone === "info" && "border-[var(--color-border)] bg-[var(--color-canvas-raised)]",
            )}
          >
            <div
              className={cn(
                "mt-0.5 shrink-0",
                toast.tone === "success" && "text-[var(--color-success)]",
                toast.tone === "error" && "text-[var(--color-danger)]",
                toast.tone === "info" && "text-[var(--color-accent)]",
              )}
            >
              {toast.tone === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <ToastPrimitive.Title className="text-sm font-semibold">{toast.title}</ToastPrimitive.Title>
              {toast.description && (
                <ToastPrimitive.Description className="mt-0.5 text-sm text-[var(--color-ink-muted)]">
                  {toast.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]">
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
