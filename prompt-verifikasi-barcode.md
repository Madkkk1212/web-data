# Prompt Project: Sistem Verifikasi Data dengan Barcode (mirip e-AC Mahkamah Agung)

Project Next.js sudah terinstal. Konsepnya: **admin input data di dashboard → sistem generate barcode/QR yang mengarah ke link verifikasi unik → siapa saja yang scan barcode akan dibuka ke halaman publik yang menampilkan data tersebut** (persis seperti halaman `eac.mahkamahagung.go.id/verifikasi/akta_cerai/...`).

---

## PROMPT BUILD (siap pakai di Claude Code / Cursor)

```
Project Next.js sudah ada dan sudah terinstal. Tolong buatkan fitur berikut:

0. KONFIGURASI PENTING (karena project ini nanti akan di-deploy dan dipakai customer, 
   bukan cuma dijalankan di localhost):
   - Buat env variable "NEXT_PUBLIC_BASE_URL" di file .env, JANGAN hardcode "localhost:3000" 
     di manapun. Semua kode yang generate URL untuk QR code harus baca dari variable ini, 
     supaya nanti pas deploy ke domain production tinggal ganti nilai env-nya saja.
   - Gunakan Prisma dengan provider "postgresql" (bukan sqlite) dari awal, walaupun untuk 
     development pakai database gratis dari Neon atau Supabase, supaya nanti tidak perlu 
     migrasi ulang saat production.

1. SETUP DATABASE (Prisma + PostgreSQL, connection string dari .env / DATABASE_URL)
   Buat model "Verifikasi" dengan field:
   - id (auto increment)
   - token (string unik, random, dipakai di URL verifikasi — generate pakai nanoid/uuid lalu 
     encode base64 supaya mirip contoh: "R2RzSzVRWC8vRklTNUpxWHBGT3FNZz09")
   - judul (string, misal "AKTA CERAI", biar fleksibel kalau nanti dipakai untuk dokumen lain)
   
   - namaPenggugat, umurPenggugat, agamaPenggugat, pekerjaanPenggugat, alamatPenggugat, 
     biodataPenggugat (text panjang), statusPenggugat (enum: "SUDAH_DIGUNAKAN" / "BELUM_DIGUNAKAN")
   
   - namaTergugat, umurTergugat, agamaTergugat, pekerjaanTergugat, alamatTergugat, 
     biodataTergugat (text panjang), statusTergugat (enum: "SUDAH_DIGUNAKAN" / "BELUM_DIGUNAKAN")
   
   - createdAt, updatedAt

2. HALAMAN ADMIN — path "/gw-mgmt-portal-x7k2" (bukan "/admin", pakai path tersamar)
   - /gw-mgmt-portal-x7k2/login -> login admin (NextAuth credentials, username/password dari env)
   - Middleware proteksi semua route di bawahnya, redirect ke 404 kalau belum login
   - /gw-mgmt-portal-x7k2/dashboard -> tabel list semua data verifikasi (search + pagination), 
     tombol "Tambah Data Baru"
   - /gw-mgmt-portal-x7k2/tambah -> FORM input dengan 2 kolom berdampingan: 
     "Penggugat" dan "Tergugat", masing-masing ada field: Nama, Umur, Agama, Pekerjaan, 
     Alamat, Biodata (textarea), dan Status Simkah (dropdown: Sudah Digunakan / Belum Digunakan)
   - Setelah submit, sistem otomatis generate "token" unik dan menyimpan data
   - /gw-mgmt-portal-x7k2/data/[id] -> halaman preview data yang baru dibuat, TAMPILKAN 
     BARCODE/QR CODE yang isinya link ke "/verifikasi/[token]", ada tombol download 
     (PNG) dan tombol print barcode
   - Sediakan juga fitur edit dan hapus data dari dashboard

3. GENERATE BARCODE/QR
   - Gunakan library "qrcode.react" (QR Code, karena isinya berupa URL panjang, lebih cocok 
     dari barcode 1D/CODE128) untuk generate QR dari URL lengkap: 
     "https://domainkamu.com/verifikasi/[token]"
   - QR ditampilkan di halaman admin/data/[id], dan HARUS bisa didownload sebagai gambar

4. HALAMAN VERIFIKASI PUBLIK (hasil scan) — ini yang dilihat orang lain
   - Route: /verifikasi/[token]
   - Tampilkan card dengan header hijau-gradient bertuliskan judul (misal "VERIFIKASI AKTA CERAI")
   - Logo/lambang di tengah atas
   - Teks: "Halaman ini [nama domain] merupakan alamat resmi data verifikasi dari [nama instansi]"
   - Tabel 2 kolom: "Penggugat" dan "Tergugat" (header hijau-teal), dengan baris:
     Nama, Umur, Agama, Pekerjaan, Alamat, Biodata, dan baris terakhir "STATUS SIMKAH" 
     yang menampilkan STEMPEL/BADGE bulat warna hijau bertuliskan status masing-masing 
     (misal "BELUM DIGUNAKAN" atau "SUDAH DIGUNAKAN")
   - Kalau token tidak ditemukan di database, tampilkan halaman "Data tidak ditemukan / 
     token tidak valid"
   - Halaman ini PUBLIK, tidak perlu login, siapapun yang scan barcode/buka link bisa lihat

5. API ROUTES (app/api)
   - POST /api/verifikasi -> tambah data baru (admin only), otomatis generate token
   - GET /api/verifikasi -> list semua data (admin only, dipakai dashboard)
   - GET /api/verifikasi/[token] -> ambil satu data berdasarkan token (dipakai halaman publik, 
     TIDAK perlu login karena ini yang diakses lewat scan)
   - PUT /api/verifikasi/[id] -> update data (admin only)
   - DELETE /api/verifikasi/[id] -> hapus data (admin only)

6. STYLING
   - Tailwind CSS
   - Halaman verifikasi publik dibuat rapi persis seperti tabel identitas resmi (header 
     gradient hijau-teal, baris zebra/selang-seling warna, badge status bulat/stempel hijau)
   - Halaman admin dibuat simpel, fokus fungsi (tabel + form), tidak perlu mewah

Kerjakan bertahap: 
1) Setup Prisma + model database dulu
2) API routes
3) Halaman admin (form tambah data 2 kolom + generate QR)
4) Halaman verifikasi publik (tampilan tabel seperti contoh)
Tanyakan ke saya kalau ada keputusan desain atau nama field yang perlu dikonfirmasi.
```

---

## Catatan Penting
- **QR Code vs Barcode**: karena datanya berupa link URL (bukan sekadar kode pendek), lebih cocok pakai **QR Code**, bukan barcode 1D biasa (CODE128 dsb) — QR bisa nampung URL panjang dan lebih gampang di-scan pakai kamera HP standar.
- **Token di URL**: sebaiknya bukan ID angka urut biasa (`/verifikasi/1`, `/verifikasi/2`, dst) karena gampang ditebak orang lain buat lihat data orang lain. Pakai token acak/random seperti di contoh (`R2RzSzVRWC8vRklTNUpxWHBGT3FNZz09`).
- **Halaman verifikasi publik memang harus bisa diakses tanpa login** — itu intinya, supaya siapapun yang scan barcode bisa langsung lihat datanya. Yang perlu dijaga ketat justru sisi **admin**-nya (path tersamar + login + proteksi API tambah/edit/hapus).
- Field "judul" dibuat fleksibel supaya template ini bisa dipakai bukan cuma untuk akta cerai, kalau nanti kamu butuh jenis dokumen lain.

## Karena Mau Diserahkan ke Customer (bukan sekadar testing)
Jangan pakai SQLite + localhost + ngrok untuk versi final. Urutan yang benar:
1. Setup database production di **Neon** atau **Supabase** (PostgreSQL gratis) dari awal.
2. Push kode ke GitHub, lalu **deploy ke Vercel** (gratis untuk trafik kecil-menengah).
3. Set env variable (`NEXT_PUBLIC_BASE_URL`, `DATABASE_URL`, kredensial admin) di dashboard Vercel, bukan di kode.
4. Kalau customer minta domain sendiri (misal `namaperusahaan.com`), sambungkan lewat menu Domains di Vercel.
5. Setelah live, semua QR code yang di-generate admin otomatis pakai URL production, jadi bisa langsung discan HP customer dari mana saja tanpa perlu satu jaringan WiFi.
