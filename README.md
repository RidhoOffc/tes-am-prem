# AM Premium Creator

Platform web untuk panduan penggunaan, pemeriksaan status layanan, dan proses verifikasi melalui integrasi API resmi — dibangun dengan React 19, TypeScript, TanStack Start, Vite, dan Nitro.

## Prinsip Utama

Proyek ini dibangun dengan satu aturan yang tidak bisa ditawar: **tidak ada respons sukses palsu.**

- HTTP 200 tidak pernah ditafsirkan sebagai "berhasil" — status sebenarnya selalu divalidasi lewat Zod.
- Jika `AM_API_BASE_URL` / `AM_API_KEY` kosong, seluruh fitur verifikasi secara eksplisit melaporkan **`not_configured`** — bukan simulasi keberhasilan.
- Tidak ada endpoint yang dikarang. Tidak ada password, token autentikasi, refresh token, atau cookie yang dikumpulkan.
- Situs ini **tidak pernah** meminta pengguna menempelkan Magic Link ke dalamnya.
- Tidak ada akses atau modifikasi lisensi tanpa otorisasi dari penyedia layanan resmi.

> ⚠️ **Catatan penting**: Tidak ada API aktivasi Alight Motion resmi yang terdokumentasi secara publik pada saat proyek ini dibuat. Jangan mengisi `AM_API_BASE_URL` dengan endpoint pihak ketiga yang tidak resmi atau yang mengeksploitasi mekanisme autentikasi tanpa izin — itu melanggar prinsip proyek ini sendiri (lihat komentar di `src/lib/api/adapter.ts`). Tanpa integrasi resmi, gunakan proyek ini sebagai platform panduan dan status layanan.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React 19, TanStack Start (SSR) |
| Routing | TanStack Router (file-based) |
| Build | Vite 6, Nitro |
| Styling | Tailwind CSS v4, Radix UI |
| Data fetching | TanStack React Query |
| Validasi | Zod |
| Form | React Hook Form + @hookform/resolvers |
| Testing | Vitest |

## Struktur Proyek

```
am-premium-creator/
├── app.config.ts                 # Konfigurasi TanStack Start + Vite + Tailwind
├── .env.example
├── src/
│   ├── router.tsx                 # Router client
│   ├── vite-env.d.ts
│   ├── styles/globals.css         # Design tokens (Tailwind v4 @theme)
│   ├── routes/
│   │   ├── __root.tsx             # Shell HTML, providers, nav/footer
│   │   ├── index.tsx              # "/"
│   │   ├── aktivasi.tsx           # "/aktivasi"
│   │   ├── panduan.tsx            # "/panduan"
│   │   ├── troubleshooting.tsx    # "/troubleshooting"
│   │   ├── faq.tsx                # "/faq"
│   │   ├── status.tsx             # "/status"
│   │   ├── sistem.tsx             # "/sistem"
│   │   ├── kontribusi.tsx         # "/kontribusi"
│   │   └── api/
│   │       ├── health.ts          # GET /api/health
│   │       ├── status.ts          # GET /api/status
│   │       ├── config.ts          # GET /api/config
│   │       └── verification/
│   │           ├── request.ts     # POST /api/verification/request
│   │           └── check.ts       # POST /api/verification/check
│   ├── components/
│   │   ├── layout/                # Navbar, Footer
│   │   ├── ui/                    # Button, Card, Input, Toast, Modal, Skeleton, Badge, EmptyState, icons
│   │   └── sections/               # PageHeader, FaqAccordion
│   └── lib/
│       ├── api/
│       │   ├── env.ts              # Server-only env reader (fail-closed)
│       │   ├── schemas.ts          # Zod schemas (shared client/server)
│       │   ├── adapter.ts          # ⚠️ The honesty layer — see above
│       │   ├── http-client.ts      # fetch wrapper with timeout
│       │   └── client.ts           # Browser-side fetch helpers for /api/*
│       ├── security/
│       │   ├── headers.ts          # Secure HTTP + CORS headers
│       │   └── sanitize.ts         # PII redaction for logs
│       ├── rate-limit.ts           # In-memory fixed-window limiter
│       └── utils.ts
└── tests/                          # Vitest suites
```

## Instalasi

Prasyarat: Node.js **20.12+** (LTS direkomendasikan) dan npm.

```bash
npm install
```

## Menjalankan Development Server

```bash
cp .env.example .env
npm run dev
```

Buka `http://localhost:3000`.

Tanpa `AM_API_BASE_URL` / `AM_API_KEY` di `.env`, halaman `/aktivasi` dan `/status` akan menampilkan status "belum dikonfigurasi" — ini perilaku yang benar, bukan bug.

## Testing

```bash
npm run test        # jalankan sekali
npm run test:watch  # mode watch
npm run typecheck
```

Cakupan pengujian (`tests/`):
- Validasi email (valid, kosong, format salah, terlalu panjang, whitespace)
- Adapter verifikasi dalam keadaan tidak terkonfigurasi (tidak pernah mengklaim sukses)
- `http-client`: sukses, HTTP error, JSON tidak valid, network error, timeout
- Rate limiting: izin di bawah batas, blokir di atas batas, reset setelah window, isolasi per-key
- Redaksi PII di log
- Validasi skema respons (menolak enum status yang tidak dikenal, field tak terduga diabaikan dengan aman)

## Production Build

```bash
npm run build
npm run start
```

`npm run build` menghasilkan output Nitro di `.output/`. `npm run start` menjalankan server produksi Node.

## Deployment

Proyek ini menggunakan Nitro sebagai server engine, sehingga kompatibel dengan berbagai target deploy. Atur preset lewat env var `NITRO_PRESET` sebelum build, misalnya:

```bash
NITRO_PRESET=node-server npm run build   # Node server mandiri (default)
NITRO_PRESET=vercel npm run build        # Vercel
NITRO_PRESET=netlify npm run build       # Netlify
NITRO_PRESET=cloudflare-pages npm run build  # Cloudflare Pages
```

Daftar preset lengkap: https://nitro.build/deploy

### Environment variables yang wajib diatur di platform deploy Anda

| Variabel | Wajib? | Keterangan |
|---|---|---|
| `AM_API_BASE_URL` | Opsional | Kosongkan jika belum ada penyedia resmi. Harus `https://` jika diisi. |
| `AM_API_KEY` | Opsional | Harus diisi berpasangan dengan `AM_API_BASE_URL`. |
| `CLIENT_ORIGIN` | Disarankan | Domain frontend produksi Anda, untuk header CORS. |
| `NITRO_PRESET` | Opsional | Target deploy, default `node-server`. |

**Jangan pernah** mengekspos `AM_API_KEY` ke kode sisi klien. Modul yang membacanya (`src/lib/api/env.ts`) hanya dipanggil dari route API (`src/routes/api/**`) dan adapter server-side.

## Menghubungkan Penyedia API Resmi

Jika Anda mendapatkan akses resmi dan terdokumentasi dari penyedia layanan verifikasi:

1. Baca dokumentasi resmi mereka dan pastikan setiap endpoint yang akan dipakai benar-benar tersedia dan Anda diizinkan menggunakannya.
2. Buat Zod schema yang mencerminkan skema respons **asli** mereka di `src/lib/api/schemas.ts` (ganti/lengkapi `upstreamVerificationResultSchema`).
3. Implementasikan pemanggilan nyata di `requestVerification` / `checkVerification` / `probeUpstream` pada `src/lib/api/adapter.ts`, validasi setiap respons dengan schema tersebut, dan petakan ke tipe respons internal kita.
4. Isi `AM_API_BASE_URL` (harus `https://`) dan `AM_API_KEY` di environment produksi.
5. Jangan pernah menganggap HTTP 200 berarti sukses — hanya laporkan `verified` jika kondisi sukses yang didokumentasikan penyedia benar-benar terpenuhi.

## Troubleshooting Pengembangan

| Masalah | Solusi |
|---|---|
| `npm install` gagal karena resolusi DNS/registry | Periksa koneksi jaringan atau konfigurasi proxy npm Anda. |
| Halaman `/aktivasi` selalu menampilkan "belum dikonfigurasi" | Ini perilaku default yang benar tanpa `AM_API_BASE_URL`/`AM_API_KEY`. |
| Error tipe pada `routeTree.gen.ts` | File ini di-generate otomatis oleh plugin TanStack Start saat `npm run dev`/`build` pertama kali dijalankan — jangan diedit manual, dan jangan commit ke git (sudah ada di `.gitignore`). |
| Rate limit terasa terlalu ketat saat testing manual | Sesuaikan `limit`/`windowMs` di pemanggilan `checkRateLimit` pada `src/routes/api/verification/*.ts`. |

## Lisensi & Tanggung Jawab

Proyek ini adalah kerangka aplikasi (application shell) untuk panduan dan status layanan. Pengelola bertanggung jawab memastikan setiap integrasi pihak ketiga yang ditambahkan sesuai dengan syarat layanan penyedia terkait.
