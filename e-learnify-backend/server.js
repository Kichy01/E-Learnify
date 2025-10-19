// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Allow frontend requests (Vercel + local dev)
app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://e-learnify.vercel.app"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

// --- Configuration ---
const PORT = process.env.PORT || 10001;
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const GENAI_API_KEY = process.env.GENAI_API_KEY;

// --- Initialize Gemini client ---
let genaiClient = null;
if (!GENAI_API_KEY) {
  console.error("❌ Missing GENAI_API_KEY in .env file");
} else {
  try {
    genaiClient = new GoogleGenerativeAI(GENAI_API_KEY);
    console.log("✅ Gemini API client initialized.");
  } catch (err) {
    console.error("❌ Error initializing Gemini client:", err);
  }
}

// --- Load courses from local JSON file ---
let courses = [];
try {
  const data = fs.readFileSync("./data-courses.json", "utf8");
  courses = JSON.parse(data);
  console.log(`📚 Loaded ${courses.length} courses.`);
} catch (err) {
  console.error("⚠️ Could not load data-courses.json:", err.message);
}

// --- JWT Authentication ---
function generateToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// --- Routes ---

// Health check
app.get("/", (req, res) => {
  res.send("✅ E-Learnify backend is running.");
});

// Login route
app.post("/auth/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const token = generateToken(username);
  res.json({ token });
});

// Get all courses
app.get("/api/courses", (req, res) => {
  res.json(courses);
});

// Generate AI-powered lesson (real Gemini call)
app.post("/api/generate-lesson", verifyToken, async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.body;

    const course = courses.find((c) => c.id === courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const moduleName = course.modules[moduleIndex] || "Unnamed Module";
    const prompt = `
You are a professional e-learning content generator.
Create a detailed interactive lesson for the topic "${moduleName}" from the course "${course.title}".
Include:
- A short introduction
- 3 learning objectives
- 2 code examples (if relevant)
- A short quiz (2-3 questions)
Use clean, readable formatting.
`;

    if (!genaiClient) {
      return res.status(500).json({ error: "Gemini client not initialized" });
    }

    const model = genaiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    res.json({
      contentHtml: `<h2>${moduleName}</h2><div class="lesson-content">${text}</div>`,
    });
  } catch (err) {
    console.error("❌ Error generating lesson:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
