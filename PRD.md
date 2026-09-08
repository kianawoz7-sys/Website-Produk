# Product Requirements Document (PRD)
## KyDev Jasa Website — Company Profile & Landing Page Jasa Pembuatan Website

**Versi:** 1.0  
**Tanggal:** 8 September 2026  
**Status:** Perencanaan  

---

## 1. Latar Belakang

KyDev adalah penyedia jasa pembuatan website yang membutuhkan sebuah website company profile untuk:
- Memperkenalkan brand dan keunggulan KyDev kepada calon klien.
- Menampilkan portofolio/produk (paket layanan) yang dijual.
- Mempermudah calon klien menghubungi KyDev secara langsung via WhatsApp.
- Membangun kepercayaan lewat testimoni pelanggan.
- Menjawab pertanyaan umum (FAQ) tanpa perlu chat manual.
- Memberikan kontrol penuh kepada admin (owner KyDev) untuk mengelola konten yang tampil di website tanpa perlu edit kode.

## 2. Tujuan Produk

1. Menjadi etalase digital KyDev yang profesional dan mudah diakses calon klien.
2. Memaksimalkan konversi pengunjung menjadi lead melalui tombol WhatsApp yang mudah diakses di banyak titik halaman.
3. Memungkinkan owner KyDev mengelola produk, testimoni, dan konten tampilan secara mandiri lewat Dashboard Admin.

## 3. Target Pengguna

| Peran | Deskripsi |
|---|---|
| Pengunjung/Calon Klien | Publik umum yang mencari jasa pembuatan website, mengakses situs tanpa login |
| Admin (Owner KyDev) | Mengelola konten website: produk, testimoni, FAQ, layanan, dan pengaturan tampilan, melalui login |

## 4. Tech Stack

- **Frontend & Backend Framework:** Next.js (App Router)
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth untuk login admin)
- **Storage:** Supabase Storage (untuk gambar produk, foto/logo testimoni)
- **Styling:** Tailwind CSS (disarankan, menyesuaikan tim dev)
- **Hosting:** Vercel (disarankan untuk Next.js) + Supabase Cloud

## 5. Roadmap & Fase Pengembangan

Berdasarkan prioritas, pengembangan dibagi menjadi 3 fase:

- **Fase 1:** Beranda KyDev, Konsultasi WhatsApp
- **Fase 2:** Katalog Produk, Testimoni Pelanggan, Tanya Jawab (FAQ), Footer Layanan & Kontak
- **Fase 3:** Dashboard Admin (termasuk halaman Login)

---

## 6. Rincian Fitur

### 6.1 FASE 1

#### A. Beranda KyDev
Halaman utama yang menjadi first impression pengunjung.

**Sub Fitur:**
1. Nama & tagline KyDev
2. Keunggulan KyDev (value proposition / kenapa harus pilih KyDev)
3. Navigasi bagian website (menu ke Katalog Produk, Testimoni, FAQ, Kontak)

**Acceptance Criteria:**
- Halaman beranda menampilkan nama brand, tagline, dan minimal 3 poin keunggulan.
- Navigasi bisa scroll/klik ke section terkait pada satu halaman (single page) atau ke halaman terpisah.
- Responsive di mobile dan desktop.

#### B. Konsultasi WhatsApp
Fitur inti untuk konversi lead. Tombol WhatsApp tersedia di berbagai titik halaman.

**Sub Fitur:**
1. Tombol WhatsApp mengambang (floating button) di semua halaman
2. Tombol WhatsApp di beranda (mis. di hero section)
3. Tombol WhatsApp di setiap produk (klik langsung tanya soal paket tersebut)

**Acceptance Criteria:**
- Setiap tombol WhatsApp mengarah ke `wa.me/<nomor>` dengan pesan pre-filled berbeda sesuai konteks (mis. "Halo, saya tertarik dengan paket [Nama Produk]").
- Nomor WhatsApp diambil dari data yang bisa diatur admin (bukan hardcode), agar bisa diganti dari Dashboard Admin.

---

### 6.2 FASE 2

#### C. Katalog Produk
Menampilkan daftar paket/jasa yang dijual KyDev.

**Sub Fitur:**
1. Daftar produk (grid/list nama paket, harga jika ditampilkan, thumbnail)
2. Klik untuk membuka deskripsi lengkap (detail produk: fitur, harga, estimasi pengerjaan, tombol WA)

**Acceptance Criteria:**
- Data produk diambil dari database (bukan statis), dikelola admin.
- Setiap produk punya: nama, gambar, deskripsi singkat, deskripsi lengkap, harga (opsional tampil), status tampil/tidak.
- Klik produk membuka modal/halaman detail berisi deskripsi lengkap + tombol konsultasi WA.

#### D. Testimoni Pelanggan
Menampilkan bukti sosial dari klien yang puas.

**Sub Fitur:**
1. Daftar testimoni (list/carousel)
2. Nama & sumber testimoni (mis. nama klien, asal usaha, atau tangkapan layar chat)

**Acceptance Criteria:**
- Testimoni diambil dari database, dikelola admin (tambah/hapus/atur tampil).
- Setiap testimoni memuat: nama pemberi testimoni, isi testimoni/gambar bukti, dan sumber (opsional link atau nama usaha).

#### E. Tanya Jawab (FAQ)
Mengurangi pertanyaan repetitif ke WhatsApp dengan menjawab di website.

**Sub Fitur:**
1. Daftar pertanyaan umum
2. Buka & tutup jawaban (accordion)

**Acceptance Criteria:**
- FAQ berbentuk accordion, satu pertanyaan bisa dibuka/tutup tanpa reload halaman.
- Data FAQ dikelola admin.

#### F. Footer Layanan & Kontak
Bagian bawah halaman berisi ringkasan layanan dan cara menghubungi.

**Sub Fitur:**
1. Daftar layanan pilihan (list singkat layanan yang ditawarkan, bisa link ke produk terkait)
2. Informasi kontak (WhatsApp, email, alamat/kota, media sosial jika ada)

**Acceptance Criteria:**
- Footer tampil di semua halaman.
- Informasi kontak bisa diedit dari Dashboard Admin.

---

### 6.3 FASE 3

#### G. Dashboard Admin
Panel privat untuk owner KyDev mengelola seluruh konten website.

**Sub Fitur:**
1. Login admin
2. Atur produk tampil (tambah, edit, hapus, upload gambar, atur status tampil/sembunyi & urutan)
3. Kelola testimoni (tambah, edit, hapus testimoni, upload gambar bukti)
4. Setting tampilan front end (atur konten yang tampil, mis. teks beranda, keunggulan, nomor WhatsApp, kontak, FAQ, layanan di footer)

**Acceptance Criteria — Login Admin:**
- Menggunakan Supabase Auth (email + password).
- Halaman login terpisah dari halaman publik (`/admin/login`).
- Hanya user dengan role admin yang bisa mengakses `/admin/*` (proteksi via middleware Next.js + Row Level Security Supabase).
- Session tersimpan (tidak perlu login ulang tiap refresh) dan ada fitur logout.

**Acceptance Criteria — Manajemen Produk:**
- CRUD (Create, Read, Update, Delete) produk lewat form di dashboard.
- Upload gambar produk ke Supabase Storage.
- Toggle status "tampilkan di beranda/katalog" per produk.
- Bisa atur urutan tampil produk.

**Acceptance Criteria — Manajemen Testimoni:**
- CRUD testimoni lewat form di dashboard.
- Upload gambar bukti testimoni (opsional) ke Supabase Storage.
- Toggle status tampil per testimoni.

**Acceptance Criteria — Setting Front End:**
- Halaman setting untuk mengubah: tagline, keunggulan (list), nomor WhatsApp utama, kontak (email/alamat), daftar FAQ, daftar layanan di footer.
- Perubahan langsung tercermin di halaman publik tanpa perlu deploy ulang.

---

## 7. Struktur Data (Gambaran Skema Supabase)

| Tabel | Kolom Utama |
|---|---|
| `products` | id, name, short_description, full_description, price, image_url, is_visible, sort_order, created_at |
| `testimonials` | id, customer_name, source, content, image_url, is_visible, sort_order, created_at |
| `faqs` | id, question, answer, sort_order, is_visible |
| `services` (footer) | id, name, link_to_product_id (nullable), sort_order |
| `site_settings` | id, tagline, advantages (json/array), whatsapp_number, contact_email, contact_address |
| `admin_users` | dikelola oleh Supabase Auth (`auth.users`), ditambah tabel `profiles` jika perlu role |

> Catatan: Row Level Security (RLS) diaktifkan di semua tabel — publik hanya bisa `SELECT` data dengan `is_visible = true`, sementara `INSERT/UPDATE/DELETE` hanya untuk role admin yang terautentikasi.

## 8. Struktur Halaman (Sitemap)

```
/                      → Beranda (hero, keunggulan, navigasi, cuplikan produk/testimoni)
/produk                → Katalog Produk (atau section di beranda)
/produk/[id]           → Detail produk (atau modal)
/testimoni             → (opsional halaman khusus, atau section di beranda)
/faq                   → (opsional halaman khusus, atau section di beranda)
/admin/login           → Login admin
/admin/dashboard       → Ringkasan
/admin/produk          → Kelola produk
/admin/testimoni       → Kelola testimoni
/admin/faq             → Kelola FAQ
/admin/settings        → Setting tampilan (tagline, WA, kontak, layanan footer)
```

## 9. Non-Functional Requirements

- **Performance:** Halaman publik harus cepat (gunakan Next.js Server Components/ISR untuk data produk & testimoni).
- **Responsive:** Mobile-first, karena mayoritas traffic dari WhatsApp/mobile.
- **SEO:** Meta title/description per halaman, gambar produk pakai `alt text`.
- **Security:** RLS aktif di Supabase, admin route diproteksi middleware, tidak ada kredensial hardcode.
- **Maintainability:** Semua konten yang sering berubah (produk, testimoni, FAQ, kontak) harus dikelola dari database via Dashboard Admin, bukan hardcode di kode frontend.

## 10. Metrik Keberhasilan (Success Metrics)

- Jumlah klik tombol WhatsApp per sesi/pengunjung.
- Jumlah lead masuk via WhatsApp per bulan setelah website live.
- Waktu admin untuk menambah 1 produk/testimoni baru (target: di bawah 2 menit, tanpa bantuan developer).

## 11. Di Luar Cakupan (Out of Scope) — v1

- Sistem pembayaran online / invoice otomatis.
- Multi-admin dengan level akses berbeda (v1 asumsi single admin/owner).
- Multi-bahasa.
- Blog/artikel (bisa jadi fase lanjutan jika dibutuhkan untuk SEO).

---

*Dokumen ini adalah dasar untuk tahap desain teknis (schema Supabase detail, wireframe) dan implementasi kode dengan Next.js + Supabase.*
