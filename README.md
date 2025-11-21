# 🤖 Moniq AI - Sistem Scoring Pinjaman Mikro (Hybrid AI-WASPAS)

**Moniq AI** adalah aplikasi sistem pendukung keputusan (SPK) berbasis web untuk menilai kelayakan kredit usaha mikro, khususnya bagi nasabah *unbanked* (belum memiliki riwayat perbankan).

Sistem ini menggabungkan kecerdasan buatan (**Google Gemini AI**) untuk analisis data tidak terstruktur (foto & teks) dengan metode matematika **WASPAS** *(Weighted Aggregated Sum Product Assessment)* untuk perhitungan skor akhir yang objektif.

## 🚀 Fitur Utama

### 1. 🧠 Analisis AI Multimodal (Gemini)
Aplikasi tidak hanya membaca teks, tapi juga "melihat" gambar:
* **Analisis Aset (C1):** AI menilai kondisi fisik usaha (kerapian, stok barang) dari foto.
* **Analisis Karakter (C2):** AI menganalisis sentimen dari catatan agen/wawancara tetangga.
* **Analisis Kapasitas (C3):** AI melakukan OCR (Optical Character Recognition) pada foto buku catatan keuangan manual (Logbook) untuk estimasi omzet.

### 2. 🧮 SPK Engine (Metode WASPAS)
Mengubah hasil analisis AI menjadi angka pasti (Ranking):
* **WSM (Weighted Sum Model):** Penjumlahan terbobot.
* **WPM (Weighted Product Model):** Perkalian terbobot.
* **Agregasi Qi:** Menggabungkan kedua metode untuk akurasi tinggi.
* **Bobot Kriteria:** Aset (30%), Karakter (30%), Kapasitas (40%).

### 3. 🔄 Pemilihan Model AI Dinamis
* Otomatis mendeteksi model AI yang tersedia di akun Google AI Studio pengguna (Real-time fetching).
* User bisa memilih menggunakan `gemini-1.5-flash`, `gemini-1.5-pro`, atau model eksperimental lainnya langsung dari UI.

### 4. 🏆 Leaderboard / Ranking System
* Halaman khusus untuk melihat daftar prioritas nasabah.
* Data diurutkan otomatis dari skor tertinggi (Layak) ke terendah.
* Status otomatis: **APPROVED** (Skor > 6.0) atau **REJECTED**.

### 5. ☁️ Arsitektur Hemat Biaya (Serverless)
* **Database:** Firebase Firestore (NoSQL).
* **Backend:** Next.js API Routes.
* **Storage Strategy:** Menggunakan Base64 processing (tanpa Firebase Storage Bucket) untuk menghindari biaya cloud storage dan masalah region.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend:** Next.js 15/16 (App Router), React, Tailwind CSS.
* **Language:** TypeScript.
* **AI Provider:** Google Generative AI SDK (`@google/generative-ai`).
* **Database:** Google Firebase (Firestore).

---

## 📂 Struktur Project

```bash
src/app/
├── api/
│   ├── get-models/     # API: Cek model Gemini yang aktif
│   ├── process-data/   # API: Proses gambar ke AI & Hitung WASPAS
│   └── ranking/        # API: Ambil data ranking dari DB
├── ranking/
│   └── page.tsx        # Halaman Leaderboard/Klasemen
├── page.tsx            # Halaman Utama (Input Form)
└── layout.tsx          # Layout global
lib/
└── firebase.ts         # Konfigurasi koneksi database