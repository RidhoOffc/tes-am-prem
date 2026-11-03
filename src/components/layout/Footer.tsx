import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-canvas-raised)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] text-sm font-bold text-[var(--color-canvas)]">
              AM
            </span>
            <span>Premium Creator</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-[var(--color-ink-muted)]">
            Platform panduan, pemeriksaan status layanan, dan verifikasi melalui integrasi API resmi. Kami tidak
            pernah mengklaim keberhasilan tanpa konfirmasi nyata dari penyedia layanan.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Navigasi</h4>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
            <li><Link to="/panduan" className="hover:text-[var(--color-ink)]">Panduan</Link></li>
            <li><Link to="/troubleshooting" className="hover:text-[var(--color-ink)]">Troubleshooting</Link></li>
            <li><Link to="/faq" className="hover:text-[var(--color-ink)]">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Sistem</h4>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
            <li><Link to="/status" className="hover:text-[var(--color-ink)]">Status Layanan</Link></li>
            <li><Link to="/sistem" className="hover:text-[var(--color-ink)]">Arsitektur & Privasi</Link></li>
            <li><Link to="/kontribusi" className="hover:text-[var(--color-ink)]">Kontribusi</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] px-4 py-5 text-center text-xs text-[var(--color-ink-subtle)] sm:px-6">
        © {new Date().getFullYear()} AM Premium Creator. Tidak berafiliasi dengan penyedia layanan pihak ketiga mana pun.
      </div>
    </footer>
  );
}
