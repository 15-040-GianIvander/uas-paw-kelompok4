# 🎫 Event Ticketing System - UAS Pengembangan Aplikasi Web

**Kelompok [NAMA KELOMPOK/NOMOR] - Studi Kasus 8**

Repository ini berisi source code untuk **Event Ticketing System**, sebuah platform manajemen acara dan pemesanan tiket online. Proyek ini dikembangkan sebagai Ujian Akhir Semester (UAS) mata kuliah Pengembangan Aplikasi Web (IF25-22014) di Institut Teknologi Sumatera.

---

## 👥 Anggota Tim

| NIM | Nama Lengkap | Role | Tanggung Jawab Utama |
|-----|--------------|------|----------------------|
| 121140xxx | [Nama Ketua] | **Team Leader** | Project Manager, Integration, Deployment |
| 121140xxx | [Nama Anggota 1] | **Backend Dev** | API Endpoints, Auth, Logic |
| 121140xxx | [Nama Anggota 2] | **Frontend Dev** | UI/UX, React Components, Integration |
| 121140xxx | [Nama Anggota 3] | **Database Sp.** | Database Design, Migrations, Models |
| 121140xxx | [Nama Anggota 4] | **Frontend Dev** | Form Handling, Styling, Responsiveness |

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
* Python 3.x
* **Pyramid Framework**
* **SQLAlchemy** (ORM)
* **Alembic** (Database Migrations)
* Waitress (WSGI Server)

**Database:**
* **PostgreSQL**

---

## 🧪 Testing API

Untuk testing API, Anda dapat menggunakan koleksi Postman yang telah disediakan:

**[📌 Postman Collection - Event Ticketing API](https://kyura-7439799.postman.co/workspace/Kyura's-Workspace~7fd240d7-b268-4301-84b5-a18242933d82/collection/46103004-9ca7aac7-98d8-4e43-80bf-3adad53be21a?action=share&creator=46103004)**

Koleksi ini berisi seluruh endpoint API yang tersedia untuk testing:
- User Authentication (Register, Login)
- Event Management (CRUD Operations)
- Booking System
- Dan endpoint lainnya

---

## 🗄️ Database Schema (ERD)

Aplikasi ini menggunakan 3 tabel utama yang saling berelasi:
1.  **Users:** Menyimpan data pengguna dan peran (role).
2.  **Events:** Menyimpan detail acara yang dibuat oleh Organizer.
3.  **Bookings:** Menyimpan transaksi tiket antara Attendee dan Event.

*(Simpan gambar ERD kamu di folder `docs/erd.png` dan uncomment baris di bawah ini)*
---

## 🚀 Cara Instalasi & Menjalankan (Local Development)

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal.

### Prasyarat
* Python 3.8+
* Node.js & NPM
* PostgreSQL Server

### 1. Setup Backend (Pyramid)

```bash
# Masuk ke folder backend
cd backend

# Buat Virtual Environment
python -m venv venv

# Aktifkan Venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -e .
pip install pyramid sqlalchemy alembic psycopg2-binary waitress

# Konfigurasi Database
# 1. Buat database kosong bernama 'ticketing_db' di PostgreSQL
# 2. Edit file development.ini, sesuaikan 'sqlalchemy.url' dengan user/pass kalian

# Jalankan Migrasi Database
alembic upgrade head

# Jalankan Server
pserve development.ini --reload