# 🧠 E-Learnify Backend (Node + Express + Gemini API)

This is the backend server for **E-Learnify**, an AI-powered e-learning platform that generates dynamic lessons using **Google Gemini**.

---

## ⚙️ Tech Stack
- Node.js + Express.js
- Google Generative AI SDK (`@google/generative-ai`)
- dotenv, cors, body-parser, jsonwebtoken
- Local JSON data storage (`data-courses.json`)

---

## 📁 Folder Structure
```
E-Learnify/
├── e-learnify-frontend/
└── e-learnify-backend/
    ├── server.js
    ├── data-courses.json
    ├── package.json
    ├── .env
    └── README.md
```

---

## 🔧 Environment Variables
Create a `.env` file in `e-learnify-backend/`:

```bash
GENAI_API_KEY=your_real_gemini_api_key
JWT_SECRET=your_secret_key
PORT=10000
```

---

## 🚀 Running Locally
```bash
cd e-learnify-backend
npm install
npm start
```
Expected log:
```
✅ Gemini API client initialized.
📚 Loaded 5 courses.
🚀 Server running on port 10000
```

---

## 🧪 API Endpoints
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/auth/login` | Returns JWT token | ❌ |
| GET  | `/api/courses` | Returns list of courses | ❌ |
| POST | `/api/generate-lesson` | Generates a Gemini-based lesson | ✅ Bearer Token |

---

## ☁️ Deployment (Render)
Since the backend lives inside the main repository:
1. Go to [https://render.com](https://render.com)
2. Create a **New Web Service**
3. Connect your GitHub repo → [Kichy01/E-Learnify](https://github.com/Kichy01/E-Learnify)
4. Under **Root Directory**, set:
   ```
   e-learnify-backend
   ```
5. Configuration:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   ```
   GENAI_API_KEY=your_gemini_key
   JWT_SECRET=your_secret_key
   PORT=10000
   ```
7. Deploy 🎉  
   Render will generate a live URL like:
   ```
   https://e-learnify-backend.onrender.com
   ```

---

**Author:** [Emmanuel Kichinda](https://github.com/Kichy01)
