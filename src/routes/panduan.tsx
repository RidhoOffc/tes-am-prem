import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/sections/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const Route = createFileRoute("/panduan")({
  component: PanduanPage,
});

const steps = [
  {
    title: "1. Siapkan email aktif",
    body: "Gunakan alamat email yang benar-benar dapat Anda akses, karena proses autentikasi resmi akan dikirim ke sana.",
  },
  {
    title: "2. Buka halaman Aktivasi",
    body: "Masuk ke halaman /aktivasi dan baca persyaratan sebelum mengisi form.",
  },
  {
    title: "3. Masukkan email Anda",
    body: "Form akan memvalidasi format email secara langsung di browser sebelum dikirim ke server.",
  },
  {
    title: "4. Tunggu respons backend",
    body: "Backend akan menghubungi integrasi API yang telah dikonfigurasi. Jika belum ada integrasi resmi yang terhubung, Anda akan melihat status \"belum dikonfigurasi\" — bukan keberhasilan palsu.",
  },
  {
    title: "5. Selesaikan autentikasi di kanal resmi",
    body: "Jika integrasi tersedia, Anda akan diarahkan untuk menyelesaikan autentikasi langsung di halaman atau email resmi penyedia layanan — tidak pernah di situs ini.",
  },
  {
    title: "6. Periksa hasil",
    body: "Hasil akhir (berhasil, gagal, atau kedaluwarsa) ditampilkan berdasarkan status nyata dari backend.",
  },
];

function PanduanPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Panduan"
        title="Cara Menggunakan Layanan"
        description="Ikuti langkah-langkah berikut untuk memahami alur penggunaan AM Premium Creator dari awal sampai akhir."
      />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="space-y-5">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-[var(--color-ink-muted)]">{step.body}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
