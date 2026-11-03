import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/sections/PageHeader";
import { FaqAccordion } from "~/components/sections/FaqAccordion";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

const faqItems = [
  {
    question: "Apa itu AM Premium Creator?",
    answer:
      "AM Premium Creator adalah platform yang menyediakan panduan, pemeriksaan status layanan, dan proses verifikasi melalui integrasi API resmi yang telah dikonfigurasi dan diizinkan.",
  },
  {
    question: "Apakah layanan ini menjamin aktivasi berhasil?",
    answer:
      "Tidak. Kami tidak pernah menjamin keberhasilan. Hasil yang ditampilkan selalu berdasarkan respons nyata dari backend dan penyedia API resmi, apa pun hasilnya.",
  },
  {
    question: "Data pribadi apa yang dikumpulkan?",
    answer:
      "Hanya alamat email yang Anda masukkan untuk memulai proses verifikasi. Kami tidak pernah mengumpulkan password, token autentikasi, refresh token, atau cookie pribadi Anda.",
  },
  {
    question: "Kenapa saya tidak diminta memasukkan password di sini?",
    answer:
      "Karena proses autentikasi yang sah selalu terjadi langsung di kanal resmi penyedia layanan (halaman atau email mereka), bukan di situs pihak ketiga mana pun, termasuk situs ini.",
  },
  {
    question: "Apa yang terjadi jika integrasi API belum tersedia?",
    answer:
      "Website akan menampilkan status \"integrasi belum dikonfigurasi\" secara eksplisit. Fitur panduan dan troubleshooting tetap dapat digunakan secara normal.",
  },
  {
    question: "Bagaimana cara melaporkan bug atau masalah teknis?",
    answer: "Kunjungi halaman Kontribusi untuk melihat informasi kontak pengembang.",
  },
  {
    question: "Apakah kode sumber proyek ini terbuka?",
    answer: "Struktur proyek dan dokumentasi deployment disertakan dalam README repositori ini.",
  },
];

function FaqPage() {
  return (
    <div>
      <PageHeader
        eyebrow="FAQ"
        title="Pertanyaan yang Sering Diajukan"
        description="Jawaban singkat untuk pertanyaan-pertanyaan yang paling sering muncul."
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <FaqAccordion items={faqItems} />
      </div>
    </div>
  );
}
