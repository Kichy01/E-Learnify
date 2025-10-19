# 🌍 E-Learnify

**E-Learnify** is an AI-powered e-learning platform developed by [Emmanuel Kichinda](https://github.com/Kichy01).  
It dynamically generates lessons using **Google Gemini** and provides a clean, responsive interface built with **HTML, CSS, and JavaScript**.

---

## 🧩 Project Overview

| Layer | Stack | Deployment | Description |
|-------|--------|-------------|--------------|
| **Frontend** | HTML, CSS, JS | Vercel | User-facing UI |
| **Backend** | Node.js + Express | Render | Handles APIs and AI logic |
| **AI** | Google Gemini API | Google Cloud | Generates lesson content |

---

## 📁 Repository Structure
```
E-Learnify/
│
├── e-learnify-frontend/   → Frontend (HTML, CSS, JS)
│   └── README.md
│
├── e-learnify-backend/    → Backend (Node + Express + Gemini)
│   └── README.md
│
└── README.md              → General repository overview
```

---

## 🧠 Local Setup

### 1️⃣ Backend
```bash
cd e-learnify-backend
cp .env.example .env
npm install
npm start
```
Runs at: [http://localhost:10001](http://localhost:10001)

---

### 2️⃣ Frontend
```bash
cd e-learnify-frontend
npm install -g http-server
http-server -c-1
```
Runs at: [http://127.0.0.1:8080](http://127.0.0.1:8080)

---

### 3️⃣ Connect Both
Edit your `index.html` in the frontend:
```html
<script>
  window.RENDER_BACKEND_URL = "http://localhost:10001";
</script>
```

---

## ☁️ Deployment Guide

### 🔹 Backend (Render)
- **Root Directory:** `e-learnify-backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- Add `.env` variables:
  ```
  GENAI_API_KEY=your_gemini_key
  JWT_SECRET=your_secret_key
  PORT=10000
  ```

After deployment → example URL:  
`https://e-learnify-backend.onrender.com`

---

### 🔹 Frontend (Vercel)
- **Root Directory:** `e-learnify-frontend`
- **Framework Preset:** Other
- **Build Command:** *(leave blank)*
- **Output Directory:** `/`
- Update `index.html` backend URL:
  ```html
  <script>
    window.RENDER_BACKEND_URL = "https://e-learnify-backend.onrender.com";
  </script>
  ```

After deployment → example URL:  
`https://e-learnify.vercel.app`

---

## 🔍 Live Architecture

```
[Vercel Frontend]
       ↓
[Render Backend]
       ↓
[Gemini API]
```

---

**Author:** [Emmanuel Kichinda](https://github.com/Kichy01)  
**Repository:** [github.com/Kichy01/E-Learnify](https://github.com/Kichy01/E-Learnify)
