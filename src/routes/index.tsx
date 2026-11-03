import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { FaqAccordion } from "~/components/sections/FaqAccordion";
import { ShieldCheck, Activity, BookOpen, Lock } from "~/components/ui/icons";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  {
    icon: ShieldCheck,
    title: "Verifikasi yang jujur",
    description:
      "Status hanya ditampilkan berdasarkan respons nyata dari backend — tidak pernah ada klaim berhasil yang dipalsukan.",
  },
  {
    icon: Activity,
    title: "Status layanan transparan",
    description: "Pantau kesehatan server dan status integrasi API secara real-time di halaman Status.",
  },
  {
    icon: BookOpen,
    title: "Panduan lengkap",
    description: "Tutorial langkah demi langkah dan daftar solusi untuk masalah yang umum terjadi.",
  },
  {
    icon: Lock,
    title: "Privasi diutamakan",
    description:
      "Kami tidak pernah meminta password, token autentikasi, atau Magic Link Anda untuk ditempelkan ke situs ini.",
  },
];

const requirements = [
  "Alamat email aktif yang dapat menerima tautan dari penyedia layanan resmi.",
  "Koneksi internet yang stabil saat proses autentikasi berlangsung.",
  "Kesabaran — verifikasi hanya berjalan melalui mekanisme resmi penyedia API, bukan jalan pintas.",
];

const shortFaq = [
  {
    question: "Apakah situs ini menjamin akun saya pasti menjadi premium?",
    answer:
      "Tidak. Kami hanya menjalankan proses verifikasi melalui integrasi API yang sah dan menampilkan hasil apa adanya — berhasil atau gagal — sesuai respons resmi dari penyedia layanan.",
  },
  {
    question: "Apakah saya perlu menempelkan Magic Link ke situs ini?",
    answer: "Tidak pernah. Proses autentikasi selalu dilakukan langsung melalui halaman atau email resmi penyedia layanan.",
  },
  {
    question: "Bagaimana jika integrasi API belum tersedia?",
    answer:
      "Halaman Aktivasi dan Status akan menampilkan status \"integrasi belum dikonfigurasi\" secara jujur, bukan berpura-pura berhasil.",
  },
];

function HomePage() {
  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-canvas-raised)] to-[var(--color-canvas)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-canvas-raised)] px-3 py-1 text-xs font-medium text-[var(--color-ink-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Integrasi API resmi &middot; Tanpa klaim palsu
          </span>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Panduan, status, dan verifikasi yang <span className="text-[var(--color-accent)]">benar-benar jujur</span>
          </h1>
          <p className="max-w-xl text-lg text-[var(--color-ink-muted)]">
            AM Premium Creator membantu Anda memahami proses verifikasi layanan secara transparan — setiap status yang
            ditampilkan berasal dari respons backend yang sebenarnya, bukan simulasi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link to="/aktivasi">Mulai Verifikasi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/panduan">Baca Panduan</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Mengapa AM Premium Creator</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-canvas-raised)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Persyaratan</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {requirements.map((req, i) => (
              <li key={req} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-canvas)] p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-xs font-semibold text-[var(--color-canvas)]">
                  {i + 1}
                </span>
                <span className="text-sm text-[var(--color-ink-muted)]">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Pertanyaan Singkat</h2>
          <Link to="/faq" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
            Lihat semua FAQ →
          </Link>
        </div>
        <div className="mt-8 max-w-3xl">
          <FaqAccordion items={shortFaq} />
        </div>
      </section>
    </div>
  );
}
