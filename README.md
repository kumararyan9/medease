# MedEase — Doctor Appointment Booking System

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)]()
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)]()

---

## Project Overview

**MedEase** is a full-stack MERN web application that streamlines the process of booking medical appointments online. It supports three roles — **Admin**, **Doctor**, and **Patient** — each with a dedicated, role-protected dashboard.

---

## Key Features

### Patient
- Register and log in with JWT authentication
- Browse doctors by speciality
- Book, view, and cancel appointments
- Manage profile and upload profile photo
- Online payment (mock)

### Doctor
- Secure login and role-based dashboard
- View, confirm, complete, or cancel appointments
- Update professional profile and photo

### Admin
- Onboard new doctors with image upload
- Toggle doctor availability
- View all appointments and system metrics

### Platform
- bcrypt password hashing
- Cloudinary CDN for image storage
- Indian Rupee (₹) currency throughout
- Fully responsive UI (Tailwind CSS)

---

## Project Structure

```
medease-health-portal/
├── medease-client/     # Patient portal  (React + Vite)
├── medease-admin/      # Admin & Doctor portal (React + Vite)
└── medease-server/     # REST API (Node.js + Express + MongoDB)
```

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 19, Vite, Tailwind CSS, Axios, React Router |
| Backend   | Node.js, Express 5, Mongoose |
| Database  | MongoDB Atlas |
| Auth      | JSON Web Tokens (JWT) |
| Storage   | Cloudinary + Multer |
| Notifications | React Toastify |

---

## Installation & Setup

### Prerequisites
- Node.js ≥ 18
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd medease-health-portal
```

### 2. Server setup

```bash
cd medease-server
npm install
cp .env.example .env   # then fill in your real values
npm run server
```

### 3. Patient portal setup

```bash
cd ../medease-client
npm install
cp .env.example .env
npm run dev            # runs on http://localhost:5173
```

### 4. Admin portal setup

```bash
cd ../medease-admin
npm install
cp .env.example .env
npm run dev            # runs on http://localhost:5174
```

---

## Environment Variables

Copy each `.env.example` to `.env` and replace the placeholder values.

### `medease-server/.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `8000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing tokens |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

### `medease-client/.env` and `medease-admin/.env`

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Base URL of the running server (e.g. `http://localhost:8000`) |

---

## API Endpoints

### User Routes (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new patient |
| POST | `/login` | Login and receive token |
| GET | `/get-profile` | Get logged-in patient profile |
| POST | `/update-profile` | Update profile with optional image |
| POST | `/book-appointment` | Book an appointment |
| GET | `/appointments` | List patient's appointments |
| POST | `/cancel-appointment` | Cancel a booking |
| POST | `/make-payment` | Process mock payment |

### Doctor Routes (`/api/doctor`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | List all doctors |
| POST | `/login` | Doctor login |
| GET | `/appointments` | Doctor's appointments |
| POST | `/complete-appointment` | Mark appointment complete |
| POST | `/cancel-appointment` | Cancel an appointment |
| GET | `/dashboard` | Doctor dashboard metrics |
| GET | `/profile` | Get doctor profile |
| POST | `/update-profile` | Update doctor profile |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Admin login |
| POST | `/add-doctor` | Add new doctor |
| GET | `/all-doctors` | List all doctors |
| POST | `/change-availability` | Toggle doctor availability |
| GET | `/appointments` | All appointments |
| POST | `/cancel-appointment` | Cancel any appointment |
| GET | `/dashboard` | Admin dashboard metrics |

---

## Deployment

- **Server**: Render, Railway, or DigitalOcean
- **Portals**: Vercel or Netlify
- Set all environment variables on the hosting platform before deploying.

---

## Author

**Kumar Aryan**

---

## Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — cloud database
- [Cloudinary](https://cloudinary.com/) — image hosting
- The open-source MERN community
