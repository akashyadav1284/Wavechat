import dotenv from "dotenv";
dotenv.config();

import { app, server } from "./socket/socket.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Explicit origins from env var (comma-separated)
const explicitOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow no-origin requests (Postman, curl)
  if (explicitOrigins.includes(origin)) return true; // Explicit whitelist
  if (/\.vercel\.app$/.test(origin)) return true; // Any Vercel preview/prod URL
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true; // Any localhost port
  return false;
};

console.log("🔒 CORS explicit origins:", explicitOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked: ${origin}`);
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
};

// Apply CORS to all routes (must be FIRST middleware)
app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight for all routes
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "WaveChat server is running 🌊" });
});

// Connect to DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🌊 WaveChat server running on port ${PORT}`);
  });
});
