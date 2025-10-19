# 🎓 E-Learnify Frontend (HTML + CSS + Vanilla JS)

This is the **frontend** for the E-Learnify platform — a modern, responsive interface built using only **HTML**, **CSS**, and **JavaScript**.  
It communicates with the backend to fetch courses and display AI-generated lessons powered by **Google Gemini**.

---

## 🌐 Architecture
```
Frontend (Vercel)
   ↓
Backend (Render)
   ↓
Gemini API (Google Generative AI)
```

---

## 🖥 Features
- Lightweight static interface (no frameworks)
- JWT-based login and token handling
- Fetches course list dynamically
- Displays AI-generated lessons from Gemini

---

## 📁 Folder Structure
```
E-Learnify/
├── e-learnify-backend/
└── e-learnify-frontend/
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── data-courses.json
    └── README.md
```

---

## ⚙️ Backend Configuration
Set your backend URL in `index.html`:

### For local testing:
```html
<script>
  window.RENDER_BACKEND_URL = "http://localhost:10001";
</script>
```

### For production (after Render deployment):
```html
<script>
  window.RENDER_BACKEND_URL = "https://e-learnify-backend.onrender.com";
</script>
```

---

## 🚀 Running Locally
```bash
cd e-learnify-frontend
npm install -g http-server
http-server -c-1
```
Then open:
👉 [http://127.0.0.1:8080](http://127.0.0.1:8080)

---

## ☁️ Deployment (Vercel)
You can deploy directly from this subfolder in your main repo:

1. Go to [https://vercel.com](https://vercel.com)
2. Import repo → [Kichy01/E-Learnify](https://github.com/Kichy01/E-Learnify)
3. Under **Root Directory**, set:
   ```
   e-learnify-frontend
   ```
4. Configuration:
   - **Framework Preset:** Other
   - **Build Command:** *(leave blank)*
   - **Output Directory:** `/`
5. Deploy 🚀  
   You’ll get a live URL like:
   ```
   https://e-learnify.vercel.app
   ```

---

**Author:** [Emmanuel Kichinda](https://github.com/Kichy01)
