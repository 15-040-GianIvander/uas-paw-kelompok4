# API Documentation – Event Ticketing System

Dokumentasi ini menjelaskan **seluruh endpoint Backend (API)** pada aplikasi **Event Ticketing System**. Dokumentasi ini disusun berdasarkan implementasi backend dan **selaras dengan Postman Collection serta Dokumen PDF Dokumentasi API**.

API menggunakan arsitektur **RESTful**, format data **JSON**, serta autentikasi **JWT (Bearer Token)**.

---

## Base URL

### Local Development

```
http://localhost:6543/api
```

### Production

```
https://nama-backend.my.id/api
```

---

## Authentication

Endpoint tertentu memerlukan autentikasi menggunakan **Bearer Token (JWT)**.

Header:

```
Authorization: Bearer <token>
```

Token diperoleh dari endpoint **Login** dan wajib disimpan di frontend (LocalStorage).

---

## 1. Authentication (Login & Register)

### Register Akun

* **Method:** POST
* **Endpoint:** `/register`
* **Auth:** Tidak

**Request Body (JSON):**

```json
{
  "name": "Nama User",
  "email": "user@email.com",
  "password": "password"
}
```

**Response:**

```json
{
  "message": "Success",
  "id": "user_id"
}
```

> Role default akan menjadi **User**.

---

### Login Akun

* **Method:** POST
* **Endpoint:** `/login`
* **Auth:** Tidak

**Request Body:**

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

**Response:**

```json
{
  "token": "jwt-token",
  "role": "user",
  "user_id": "id"
}
```

---

### Logout

* **Method:** POST
* **Endpoint:** `/logout`

**Response:**

```json
{
  "message": "Logout successful"
}
```

---

### Forgot Password

* **Method:** POST
* **Endpoint:** `/forgot-password`

**Request Body:**

```json
{
  "email": "user@email.com"
}
```

---

### Reset Password

* **Method:** POST
* **Endpoint:** `/reset-password`

**Request Body:**

```json
{
  "email": "user@email.com",
  "token": "reset-token",
  "new_password": "newpassword"
}
```

---

## 2. User Profile

### Get Profile

* **Method:** GET
* **Endpoint:** `/profile`
* **Auth:** User

**Response:**

```json
{
  "name": "User",
  "bio": "...",
  "profile_picture_url": "..."
}
```

---

### Update Profile

* **Method:** POST
* **Endpoint:** `/profile`
* **Auth:** User

**Payload:** `FORM-DATA`

* name
* bio
* phone_number
* location
* profile_picture (file)

---

## 3. Event Management

### List Events

* **Method:** GET
* **Endpoint:** `/events`
* **Auth:** Public

---

### Event Detail

* **Method:** GET
* **Endpoint:** `/events/{id}`

---

### Create Event

* **Method:** POST
* **Endpoint:** `/events`
* **Auth:** Admin

**Payload:** `FORM-DATA`

* title
* date (YYYY-MM-DD HH:MM)
* location
* capacity
* ticket_price
* image (file)

---

### Update Event

* **Method:** PUT
* **Endpoint:** `/events/{id}`
* **Auth:** Admin

---

### Delete Event

* **Method:** DELETE
* **Endpoint:** `/events/{id}`
* **Auth:** Admin

---

## 4. Booking & Payment

### Booking Ticket (Step 1)

* **Method:** POST
* **Endpoint:** `/bookings`
* **Auth:** User

**Request Body:**

```json
{
  "event_id": "id",
  "quantity": 1,
  "payment_method": "qris",
  "whatsapp": "08xxxxxxxx"
}
```

**Response:**

```json
{
  "status": "pending",
  "payment_info": {
    "details": "QR / VA"
  }
}
```

---

### Confirm Payment (Step 2)

* **Method:** POST
* **Endpoint:** `/bookings/{id}/pay`

---

### My Booking History

* **Method:** GET
* **Endpoint:** `/my-bookings`

---

## 5. Superadmin

### List Users

* **Method:** GET
* **Endpoint:** `/superadmin/users`

---

### Create User / Admin

* **Method:** POST
* **Endpoint:** `/superadmin/users`

---

### Update User Role

* **Method:** PUT
* **Endpoint:** `/superadmin/users/{id}`

---

### Delete User

* **Method:** DELETE
* **Endpoint:** `/superadmin/users/{id}`

---

## Testing API

Seluruh endpoint diuji menggunakan **Postman** dan telah disesuaikan dengan Postman Collection proyek.
