# 🌾 Sistem Informasi Lembaga Ekonomi Tiyuh - Kagungan Ratu Agung

Platform digital berbasis web untuk mempromosikan dan mengelola potensi ekonomi lokal Tiyuh Kagungan Ratu Agung. Sistem ini mengintegrasikan tiga pilar ekonomi utama: **BUMTI (Badan Usaha Milik Tiyuh)**, **UMKM**, dan **Koperasi**.

Project ini terdiri dari **Halaman Publik** untuk masyarakat dan **Panel Admin** untuk pengelola data.

![Preview Website](frontend/public/logo.jpeg) 
*(Ganti baris ini dengan screenshot website Anda jika ada)*

---

## 🚀 Fitur Utama

### 🌍 Sisi Pengguna (Public User)
* **Beranda Responsif:** Tampilan modern dengan Hero Slider dan Kartu Kategori (BUMTI, UMKM, Koperasi).
* **Pencarian Produk:** Fitur pencarian realtime untuk menemukan produk spesifik.
* **Navigasi Kategori:** Halaman khusus untuk BUMTI, UMKM, dan Koperasi.
* **Panduan Mitra:** Informasi langkah-langkah bagi warga yang ingin mendaftarkan produknya.
* **Mobile-First Design:** Tampilan grid 2 kolom yang rapi pada perangkat HP/Tablet.

### 🛡️ Sisi Admin (Pengelola)
* **Secure Authentication:** Login aman menggunakan Token (JWT).
* **Reset Password:** Fitur reset password admin menggunakan kode rahasia.
* **Dashboard Terpadu:** Ringkasan data dan navigasi cepat.
* **Manajemen Produk (CRUD):** Tambah, Edit, Hapus, dan Lihat produk berdasarkan kategori.
* **Manajemen Slider:** Mengatur gambar banner promosi di halaman depan.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
* **Framework:** [React + Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Routing:** React Router DOM v6
* **HTTP Client:** Axios
* **Icons:** React Icons (FontAwesome)
* **Notifikasi:** React Hot Toast & SweetAlert2

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL
* **ORM:** Sequelize (atau raw SQL tergantung implementasi Anda)
* **Auth:** JSON Web Token (JWT)

---

## 📂 Struktur Folder

```bash
project-root/
├── backend/          # Server API (Node.js/Express)
│   ├── config/       # Koneksi Database
│   ├── controllers/  # Logika bisnis
│   ├── models/       # Skema Database
│   ├── routes/       # Endpoint API
│   └── uploads/      # Penyimpanan file gambar
│
└── frontend/         # Client Side (React/Vite)
    ├── public/       # File statis (logo.jpeg, favicon)
    ├── src/
    │   ├── api/      # Konfigurasi Axios
    │   ├── assets/   # Gambar statis (bg-login.jpg)
    │   ├── components/
    │   │   ├── admin/ # Komponen khusus Admin
    │   │   ├── common/# Navbar, Slider
    │   │   └── ui/    # Kartu Produk, Modal
    │   ├── pages/    # Halaman User & Admin
    │   └── routes/   # Konfigurasi AppRoutes & PrivateRoute