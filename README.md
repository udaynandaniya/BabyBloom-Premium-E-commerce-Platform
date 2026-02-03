# 🌸 BabyBloom | Everything for Your Little One

**BabyBloom** is a modern, full-stack **premium baby care e-commerce platform** built with **Next.js 15**, **TypeScript**, and **MongoDB**.  
It delivers a delightful shopping experience for **baby clothes, toys, bath essentials, and newborn products** with a beautiful animated UI, secure authentication, and complete order management.

---

## 🌐 Live Demo

👉 **https://babybloomapp.vercel.app/**

---

## ✨ Key Features

### 🎨 Premium UI / UX Experience

- Animated **baby-themed background** with smooth CSS animations  
- Soft **pink, purple, and blue gradient** design system  
- **Dark / Light mode** with system preference detection  
- **Mobile-first**, fully responsive layout  
- Custom **shadcn/ui** components with premium styling  

---

### 🔐 Advanced Authentication System

- Multi-step **signup with email OTP verification**  
- Real-time validation with backend checks  
- Secure **forgot-password flow** using OTP  
- **Admin auto-detection** via configured email  
- JWT authentication with **HTTP-only encrypted cookies**  

---

### 🛒 Complete E-commerce Solution

- Multi-category product catalog:
  - 👕 Baby Clothes  
  - 🧸 Toys  
  - 🛁 Bath Products  
  - 👶 Newborn Essentials  
- Persistent **smart cart** with stock validation  
- Complete **order lifecycle management**  
- Professional **PDF invoice generation**  
- Real-time **inventory tracking**  

---

### 🧑‍💼 Comprehensive Admin Panel

- Order acceptance, dispatch & completion workflow  
- Full **product CRUD** management  
- Customer order history & insights  
- **Sales analytics dashboard**  
- Bulk inventory & order operations  

---

### 📍 Smart Location System (India-Focused 🇮🇳)

- State → District → Sub-district → Village selection  
- **6-digit pincode validation**  
- Zone-based delivery charges  
- Smart address autocomplete  

---

## 🛠 Tech Stack

### 🎨 Frontend

- **Next.js 15** (App Router, Server Components)  
- **TypeScript** (Strict Mode)  
- **Tailwind CSS**  
- **shadcn/ui**  
- **Framer Motion**  
- **Lucide React**  

---

### ⚙️ Backend

- Next.js **API Routes**  
- **MongoDB + Mongoose**  
- **JWT Authentication**  
- **Nodemailer** (OTP & email notifications)  
- **PDFKit** (Invoice generation)  
- **Zod** (Schema validation)  

---

## 🚀 Quick Start

### ✅ Prerequisites

- Node.js **18+**  
- MongoDB (Local or Atlas)  
- Gmail account (for OTP emails)  

---

### 🔐 Environment Setup

Create a `.env.local` file:

```env
# Database
MONGODB_URI=

# Authentication
AUTH_SECRET=your-super-secret-key-min-32-chars
JWT_SECRET=your-super-secret-key-min-32-chars

# Admin
ADMIN_EMAIL=

# Email (Gmail App Password)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# App URL
NEXT_PUBLIC_APP_URL=https://babybloomapp.vercel.app
