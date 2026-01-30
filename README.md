# 🚀 CreatorHub - Digital Product Marketplace

CreatorHub is a high-performance, full-stack digital marketplace designed for creators to monetize digital assets such as E-books, UI Kits, Templates, and Courses. This platform bridges the gap between talented creators and professionals seeking high-quality digital resources.



## 📌 Project Links
- **Live Demo:** [https://creator-hub.com](https://creator-hub-blond.vercel.app)


## 🌟 Key Features

### 🔐 Authentication
- **Multi-role Ecosystem:** Tailored experiences and dashboards for **Admin**, **Creator**, and **Buyer**.
- **Secure Auth Flow:** Implemented JWT-based authentication via **HttpOnly Cookies** to mitigate XSS risks and ensure session persistence.

### 💸 Automated Payment Gateway
- **Midtrans Core API:** Seamless payment integration supporting Virtual Accounts and E-wallets.
- **Webhook Integration:** Automated payment status updates and instant product delivery upon successful transaction.

### 🤖 AI Integration
- **AI Product Description Generator:** Integrated AI API (Gemini) to assist creators in generating professional, SEO-friendly product descriptions automatically.

### 📊 Professional Dashboards
- **Creator:** Comprehensive sales analytics, product CRUD management, and payout request tracking.
- **Admin:** Platform-wide oversight including category management and payout approval workflows.
- **Buyer:** Advanced product discovery with real-time filtering, search, and instant digital downloads.

## 🛠️ Tech Stack

### Frontend
-  Next.js (App Router)
-  TypeScript
-  Tailwind CSS
-  Shadcn UI
-  TanStack Query
-  Context API
-  React Hook Form
-  Zod 
-  Vercel

### Backend
-  Node.js
-  Express.js
-  TypeScript
-  Prisma
-  Zod
-  PostgreSQL (via Supabase)
-  Supabase Storage 
-  Railway 
  
## ⚙️ Local Setup

### Frontend
1. Clone the frontend repository.
2. Install dependencies: `npm install`.
3. Configure `.env.local` (Add Backend API URL).
4. Start development server: `npm run dev`.

### Backend
1. Clone the backend repository.
2. Install dependencies: `npm install`.
3. Configure `.env` (Add Database URL, JWT Secret, and Midtrans Server Key).
4. Run `npx prisma generate` and start: `npm run dev`.


