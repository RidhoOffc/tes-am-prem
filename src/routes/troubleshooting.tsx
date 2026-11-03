import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/sections/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export const Route = createFileRoute("/troubleshooting")({
  component: TroubleshootingPage,
});

const issues = [
  {
    problem: "Status menampilkan \"Integrasi belum dikonfigurasi\"",
    cause: "Server belum memiliki AM_API_BASE_URL dan AM_API_KEY yang valid untuk penyedia resmi.",
    solution:
      "Ini bukan bug — ini perilaku yang disengaja agar situs tidak pernah berpura-pura berhasil. Hubungi pengelola deployment untuk mengonfigurasi integrasi resmi.",
    severity: "info" as const,
  },
  {
    problem: "Form email menolak alamat yang saya masukkan",
    cause: "Format email tidak valid menurut validasi Zod di sisi klien maupun server.",
    solution: "Pastikan email menggunakan format standar, misalnya nama@domain.com, tanpa spasi atau karakter khusus.",
    severity: "warning" as const,
  },
  {
    problem: "Muncul pesan \"Terlalu banyak permintaan\"",
    cause: "Rate limiting aktif untuk mencegah penyalahgunaan endpoint verifikasi.",
    solution: "Tunggu beberapa menit sebelum mencoba lagi. Batas berlaku per alamat IP.",
    severity: "warning" as const,
  },
  {
    problem: "Halaman Status menunjukkan \"Tidak Terjangkau\"",
    cause: "Integrasi API sudah dikonfigurasi, tetapi server tidak dapat menghubungi penyedia layanan (timeout atau gangguan jaringan).",
    solution: "Coba lagi beberapa saat lagi. Jika berlanjut, hubungi pengelola untuk memeriksa konektivitas server ke penyedia API.",
    severity: "danger" as const,
  },
  {
    problem: "Saya diminta menempelkan Magic Link ke situs ini",
    cause: "Ini TIDAK PERNAH merupakan perilaku resmi situs ini.",
    solution:
      "Jangan lakukan itu. Situs ini tidak pernah meminta Anda menempelkan Magic Link, token, atau kredensial apa pun. Jika Anda melihat permintaan seperti itu, Anda mungkin berada di situs tiruan.",
    severity: "danger" as const,
  },
];

function TroubleshootingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Troubleshooting"
        title="Masalah Umum & Solusinya"
        description="Daftar masalah yang paling sering ditemui beserta penjelasan dan langkah penyelesaiannya."
      />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="space-y-5">
          {issues.map((issue) => (
            <Card key={issue.problem}>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <CardTitle className="text-base">{issue.problem}</CardTitle>
                <Badge tone={issue.severity}>
                  {issue.severity === "danger" ? "Penting" : issue.severity === "warning" ? "Perhatian" : "Info"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-sm">
                <p>
                  <span className="font-medium text-[var(--color-ink)]">Penyebab: </span>
                  <span className="text-[var(--color-ink-muted)]">{issue.cause}</span>
                </p>
                <p>
                  <span className="font-medium text-[var(--color-ink)]">Solusi: </span>
                  <span className="text-[var(--color-ink-muted)]">{issue.solution}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
