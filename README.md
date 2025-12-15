# 🚀 CreatorHub - Digital Product Marketplace

CreatorHub is a high-performance, full-stack digital marketplace designed for creators to monetize digital assets such as E-books, UI Kits, Templates, and Courses. This platform bridges the gap between talented creators and professionals seeking high-quality digital resources.

![CreatorHub Homepage Preview](https://github.com/user-attachments/assets/82c09a8f-65a6-4ffd-8db8-a05e704010c9)

## 📌 Project Links
- **Live Demo:** [https://creator-hub.com](https://creator-hub-blond.vercel.app)


## 🌟 Key Features

### 🔐 Advanced Authentication & RBAC
- **Multi-role Ecosystem:** Tailored experiences and dashboards for **Admin**, **Creator**, and **Buyer**.
- **Secure Auth Flow:** Implemented JWT-based authentication via **HttpOnly Cookies** to mitigate XSS risks and ensure session persistence.
- **Anti-Flash Route Guard:** A custom-built synchronization logic that locks the UI during authorization checks, preventing any unauthorized content flickering.

### 💸 Automated Payment Gateway
- **Midtrans Core API:** Seamless payment integration supporting Virtual Accounts and E-wallets.
- **Webhook Integration:** Automated payment status updates and instant product delivery upon successful transaction.

### 🤖 AI Integration
- **AI Product Description Generator:** Integrated AI API (Gemini/OpenAI) to assist creators in generating professional, SEO-friendly product descriptions automatically.

### 📊 Professional Dashboards
- **Creator Hub:** Comprehensive sales analytics, product CRUD management, and payout request tracking.
- **Admin Panel:** Platform-wide oversight including category management and payout approval workflows.
- **Buyer Experience:** Advanced product discovery with real-time filtering, search, and instant digital downloads.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Shadcn UI
- **State Management:** TanStack Query (React Query) & Context API
- **Form Handling:** React Hook Form & Zod (Validation)

### Backend
- **Environment:** Express.js (TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage (for assets and thumbnails)

## ⚙️ Local Setup

### Frontend
1. Clone the frontend repository.
2. Install dependencies: `npm install`.
3. Configure `.env.local` (Add Backend API URL & Midtrans Client Key).
4. Start development server: `npm run dev`.

### Backend
1. Clone the backend repository.
2. Install dependencies: `npm install`.
3. Configure `.env` (Add Database URL, JWT Secret, and Midtrans Server Key).
4. Run `npx prisma generate` and start: `npm run dev`.

## 📜 License
This project is part of my professional portfolio. Feel free to explore the code!

---
Developed by **Alim Prasetyo Putra Sinambela**
