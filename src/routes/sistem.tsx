import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/sections/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Server, Lock, ShieldCheck } from "~/components/ui/icons";

export const Route = createFileRoute("/sistem")({
  component: SistemPage,
});

function SistemPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Sistem"
        title="Arsitektur & Kebijakan Privasi"
        description="Penjelasan teknis tentang bagaimana sistem ini dibangun dan bagaimana data Anda diperlakukan."
      />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 space-y-8">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <Server className="h-5 w-5 text-[var(--color-accent)]" />
            <CardTitle className="text-base">Arsitektur</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--color-ink-muted)] space-y-3">
            <p>
              Aplikasi ini dibangun dengan arsitektur full-stack SSR menggunakan React 19, TypeScript, TanStack
              Start, Vite, dan Nitro. Frontend dan backend berjalan dalam satu basis kode, dengan server functions
              yang menangani seluruh komunikasi eksternal — tidak ada panggilan API langsung dari browser ke
              penyedia layanan pihak ketiga.
            </p>
            <p>
              Lapisan integrasi API (<code>src/lib/api/adapter.ts</code>) dipisahkan sepenuhnya dari komponen UI.
              Konfigurasi kredensial disimpan sebagai environment variable di server dan tidak pernah dikirim ke
              browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <Lock className="h-5 w-5 text-[var(--color-accent)]" />
            <CardTitle className="text-base">Keamanan</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--color-ink-muted)] space-y-2">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Semua komunikasi eksternal menggunakan HTTPS dengan timeout request.</li>
              <li>Validasi input dan output menggunakan Zod di sisi klien maupun server.</li>
              <li>Rate limiting diterapkan pada endpoint verifikasi untuk mencegah penyalahgunaan.</li>
              <li>Header keamanan standar (X-Content-Type-Options, X-Frame-Options, dll.) diterapkan pada setiap respons API.</li>
              <li>Log server tidak pernah menyimpan password, token autentikasi, atau email secara utuh.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" />
            <CardTitle className="text-base">Kebijakan Privasi</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-[var(--color-ink-muted)] space-y-2">
            <p>Kami mengumpulkan sesedikit mungkin data pribadi, dan hanya untuk tujuan yang diperlukan:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Alamat email yang Anda masukkan di halaman Aktivasi, digunakan semata-mata untuk memulai proses verifikasi.</li>
              <li>Kami tidak pernah menyimpan password, refresh token, ID token, atau cookie autentikasi Anda.</li>
              <li>Kami tidak pernah meminta Anda menempelkan Magic Link ke situs ini.</li>
              <li>Data tidak disimpan lebih lama dari yang diperlukan untuk menyelesaikan proses verifikasi.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
