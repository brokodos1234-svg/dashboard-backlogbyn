# BSS Backlog & PCR Dashboard — Site Bayan

Dashboard pemantauan progres program plan, penyerapan value (Backlog · Schedule PCR ·
Capitalize), dan status kesiapan (readiness) Backlog & PCR di Site Bayan.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk **Overview** (ringkasan), dan
[http://localhost:3000/dashboard](http://localhost:3000/dashboard) untuk **Detail Data**
(tabel Master + filter + export).

## Sumber data — 100% live dari Google Sheets

Tidak ada angka yang ditanam di kode. Setiap request membaca langsung dari spreadsheet
"Deterministic Part Site Bayan" (lihat `lib/googleSheet.ts` untuk ID sheet):

- **RESUME PENYERAPAN** — KPI total penyerapan, breakdown kategori (Backlog/Schedule
  PCR/Capitalize), tren bulanan. Diambil lewat endpoint CSV publik (`gviz/tq`), ringan & cepat.
- **RESUME DASHBOARD** — readiness snapshot (Status Eksekusi), MO Type, Status Running,
  breakdown per unit (C/N), dan daftar unit prioritas. Juga lewat CSV publik.
- **MASTER** — 71 kolom, ~37 ribu baris (satu baris per Reservation/Item). Sheet ini punya
  filter aktif di tampilan Google Sheets-nya, sehingga export CSV publik hanya mengembalikan
  baris yang sedang terlihat — **tidak bisa dipakai**. Untuk data yang benar-benar utuh, sheet
  ini dibaca dari export workbook penuh (`.xlsx`) memakai SheetJS di server (`lib/aggregate.ts`
  → `parseMasterSheet`).

Karena parsing MASTER (~25 MB, ~37 ribu baris) makan waktu ~20 detik, seluruh hasil
(`lib/dataCache.ts`) di-cache di memori server selama `CACHE_TTL_MS` (default 10 menit) dengan
pola *stale-while-revalidate*: request selalu dijawab cepat dari cache, dan refresh berjalan di
belakang layar begitu cache kedaluwarsa. Jadi mengedit spreadsheet akan otomatis terlihat di
dashboard dalam beberapa menit, tanpa perlu redeploy — untuk semua orang, bukan cuma browser
yang mengedit.

**Update data** = edit langsung spreadsheet-nya (link ada di `lib/googleSheet.ts` /
`SHEET_ID`). Siapa pun dengan akses ke sheet bisa memperbarui data.

## Halaman

| Route | Deskripsi |
|---|---|
| `/` | Overview — KPI, breakdown kategori, tren bulanan, readiness snapshot, prioritas/alert, unit prioritas, preview tabel |
| `/dashboard` | Detail Data — tabel Master lengkap dengan filter (C/N, MO Type, Status Eksekusi, Status Item, MO Open/Close, pencarian teks), pagination, Export to Excel & PDF sesuai hasil filter |
| `/dashboard/unit` | Breakdown per Unit (C/N) — 345 unit dengan status running, readiness, dan value |

## Tech stack

- Next.js 14 (App Router) + TypeScript, Tailwind CSS
- Grafik tren: SVG custom (`components/TrendChart.tsx`), tanpa dependency chart eksternal
- `xlsx` (SheetJS) untuk parsing workbook MASTER di server dan generate file Excel export di
  client
- `jspdf` + `jspdf-autotable` untuk export PDF di client

## Deploy

Target hosting: **proses Node yang hidup terus** (Railway/Render/Fly.io/VPS), **bukan** serverless
functions klasik (Netlify Functions/Vercel Functions) — karena cache data di memori
(`lib/dataCache.ts`) baru efektif kalau prosesnya tidak "dingin ulang" tiap request. Pada
serverless klasik, tiap cold start berpotensi memicu parsing ulang workbook ~25 MB (~20 detik).

**Railway** (direkomendasikan): connect repo GitHub ini ke Railway, biarkan Nixpacks
auto-detect (lihat `railway.json`) — otomatis `npm install && npm run build` lalu
`npm run start`. Tidak ada environment variable wajib (SHEET_ID & CACHE_TTL_MS punya default di
kode); set `CACHE_TTL_MS` (ms) di Railway kalau ingin mengubah durasi cache dari default 15
menit.
