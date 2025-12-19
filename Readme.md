# 🎫 Event Ticketing System - UAS Pengembangan Aplikasi Web

**Kelompok 4 - Studi Kasus 8**

Repository ini berisi source code untuk **Event Ticketing System**, sebuah platform manajemen acara dan pemesanan tiket online. Proyek ini dikembangkan sebagai Ujian Akhir Semester (UAS) mata kuliah Pengembangan Aplikasi Web (IF25-22014) di Institut Teknologi Sumatera.
Aplikasi ini memungkinkan pengguna untuk melakukan autentikasi, melihat daftar event, memesan tiket, serta memungkinkan admin atau event organizer untuk mengelola event yang tersedia.

---

## 👥 Anggota Tim

| NIM | Nama Lengkap | Role | Tanggung Jawab Utama |
|-----|--------------|------|----------------------|
| 123140040 | Gian Ivander | **Team Leader** | Project Manager, Integration, Deployment |
| 123140155 | Ahmad Ali Mukti | **Backend Dev** | API Endpoints, Auth, Logic |
| 123140137 | Anisah Octa Rohila | **Frontend Dev** | UI/UX, React Components, Integration |
| 123140018 | Garis Rayya Rabbani | **Database Sp.** | Database Design, Migrations, Models |
| 123140136 | Choirunnisa Syawaldina | **Frontend Dev** | Form Handling, Styling, Responsiveness |

---

## 📖 Deskripsi Proyek

Aplikasi ini memungkinkan pengguna untuk berperan sebagai **Organizer** (Penyelenggara) atau **Attendee** (Peserta).
* **Organizer:** Dapat membuat event, mengatur jadwal, lokasi, kapasitas, dan harga tiket, serta memantau pendaftar.
* **Attendee:** Dapat melihat daftar acara yang tersedia, memesan tiket, dan melihat riwayat pemesanan mereka.

### Fitur Utama
1.  **User Authentication:** Register & Login (Role-based: Organizer/Attendee).
2.  **Event Management:** CRUD Event (Nama, Deskripsi, Tanggal, Venue, Kapasitas, Harga).
3.  **Booking System:** Pemesanan tiket dengan validasi kuota dan generate Kode Booking unik.
4.  **Dashboard:** Panel khusus untuk melihat riwayat transaksi dan daftar peserta.

---

## 🛠️ Tech Stack

**Frontend:**
* ReactJS
* Axios (API Request)
* CSS / Tailwind (Styling)
* Vite / Create React App

**Backend:**
* Python
* **Pyramid Framework**
* **SQLAlchemy** (ORM)
* **Alembic** (Database Migrations)
* Waitress (WSGI Server)

**Database:**
* **PostgreSQL**

---

## 📄 API Documentation

Dokumentasi API backend dapat diakses melalui file [API.md](API.md).

---

## 🧪 Testing API

Untuk testing API, Anda dapat menggunakan koleksi Postman yang telah disediakan:

**[📌 Postman Collection - Event Ticketing API](https://kyura-7439799.postman.co/workspace/Kyura's-Workspace~7fd240d7-b268-4301-84b5-a18242933d82/collection/46103004-9ca7aac7-98d8-4e43-80bf-3adad53be21a?action=share&creator=46103004)**

Koleksi ini berisi seluruh endpoint API yang tersedia untuk testing:
- User Authentication (Register, Login)
- Event Management (CRUD Operations)
- Booking System
- Dan endpoint lainnya

### Langkah Testing API Menggunakan Postman
1. Buka aplikasi Postman
2. Buat request baru sesuai endpoint yang ingin diuji
3. Pilih method (GET / POST)
4. Masukkan URL endpoint
5. Untuk endpoint yang membutuhkan autentikasi:
   * Login terlebih dahulu menggunakan endpoint /api/login
   * Salin token yang didapatkan
   * Masukkan token ke tab **Authorization**, pilih **Bearer Token**
6. Kirim request dan periksa response

---

## 🗄️ Database Schema (ERD)

Aplikasi ini menggunakan 3 tabel utama yang saling berelasi:
1.  **Users:** Menyimpan data pengguna dan peran (role).
2.  **Events:** Menyimpan detail acara yang dibuat oleh Organizer.
3.  **Bookings:** Menyimpan transaksi tiket antara Attendee dan Event.

![WhatsApp Image 2025-12-11 at 16 32 24](https://github.com/user-attachments/assets/2ebfb44a-32fe-4932-815e-8b9c29153b17)
---

## 📦 Deployment Aplikasi

Aplikasi Event Ticketing System telah dideploy sehingga dapat diakses secara online tanpa perlu menjalankan aplikasi secara lokal. Proses deployment dilakukan dengan memisahkan frontend dan backend agar lebih fleksibel dan scalable.

### 🔧 Backend Deployment

Backend telah dideploy dan berfungsi sebagai penyedia REST API yang digunakan oleh frontend, berikut link backend deployment yang bisa diakses.
[Link backend]

### 🌐 Frontend Deployment

Frontend aplikasi dideploy menggunakan Vercel, berikut link frontend deployment yang bisa diakses.

[📌Frontend](https://uas-paw-kelompok4.vercel.app/)

---

## 🚀 Cara Instalasi & Menjalankan (Local Development)

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal.

### Prasyarat
* Python 3.8+
* Node.js & NPM
* PostgreSQL Server

### 1. Setup Backend (Pyramid)

```bash
# Masuk Ke Folder Backend
cd backend

# Buat Virtual Environment
python -m venv venv

# Aktifkan Venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependency
pip install -e .
pip install pyramid sqlalchemy alembic psycopg2-binary waitress

# Konfigurasi Database
# 1. Buat database kosong bernama 'ticketing_db' di PostgreSQL
# 2. Edit file development.ini, sesuaikan 'sqlalchemy.url' dengan user/pass kalian

# Jalankan Migrasi Database
alembic upgrade head

# Jalankan Server
pserve development.ini --reload

```

### 2. Setup Frontend

```bash
# Masuk Ke Folder Frontend
cd frontend

# Install Dependency
npm install

# Jalankan Aplikasi Frontend
npm run dev

```

