import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Menu, X } from "~/components/ui/icons";
import { cn } from "~/lib/utils";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/panduan", label: "Panduan" },
  { to: "/troubleshooting", label: "Troubleshooting" },
  { to: "/faq", label: "FAQ" },
  { to: "/status", label: "Status" },
  { to: "/sistem", label: "Sistem" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-canvas)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] text-sm font-bold text-[var(--color-canvas)]">
            AM
          </span>
          <span>Premium Creator</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-border)]/50 hover:text-[var(--color-ink)]"
              activeProps={{ className: "text-[var(--color-ink)] bg-[var(--color-border)]/60" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" variant="accent">
            <Link to="/aktivasi">Mulai Verifikasi</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-[var(--radius-sm)] p-2 text-[var(--color-ink)] md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--color-border)] transition-[max-height] duration-200 md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-ink)]"
              activeProps={{ className: "text-[var(--color-ink)] bg-[var(--color-border)]/60" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/aktivasi"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-3 py-2 text-center text-sm font-semibold text-white"
          >
            Mulai Verifikasi
          </Link>
        </nav>
      </div>
    </header>
  );
}
