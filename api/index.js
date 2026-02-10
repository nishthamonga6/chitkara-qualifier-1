import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "nishtha1374.be23@chitkara.edu.in";

/* ---------- ROOT ROUTE (IMPORTANT) ---------- */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Chitkara Qualifier API is running 🚀",
    official_email: EMAIL
  });
});

/* ---------- Utility Functions ---------- */
const fibonacci = (n) => {
  if (n < 0) return [];
  const res = [0, 1];
  for (let i = 2; i < n; i++) {
    res.push(res[i - 1] + res[i - 2]);
  }
  return res.slice(0, n);
};

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const hcf = (arr) => arr.reduce((a, b) => gcd(a, b));
const lcm = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));

/* ---------- POST /bfhl ---------- */
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object") {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Invalid request body",
      });
    }

    if (body.fibonacci !== undefined) {
      if (!Number.isInteger(body.fibonacci)) {
        return res.status(400).json({ is_success: false });
      }
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: fibonacci(body.fibonacci),
      });
    }

    if (body.prime !== undefined) {
      if (!Array.isArray(body.prime)) {
        return res.status(400).json({ is_success: false });
      }
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: body.prime.filter(isPrime),
      });
    }

    if (body.lcm !== undefined) {
      if (!Array.isArray(body.lcm)) {
        return res.status(400).json({ is_success: false });
      }
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: lcm(body.lcm),
      });
    }

    if (body.hcf !== undefined) {
      if (!Array.isArray(body.hcf)) {
        return res.status(400).json({ is_success: false });
      }
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: hcf(body.hcf),
      });
    }

    if (body.AI !== undefined) {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [{ parts: [{ text: body.AI }] }],
        },
        {
          params: { key: process.env.GEMINI_API_KEY },
        }
      );

      const answer =
        response.data.candidates[0].content.parts[0].text.split(" ")[0];

      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: answer,
      });
    }

    return res.status(400).json({
      is_success: false,
      official_email: EMAIL,
      error: "Invalid key",
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: "Internal Server Error",
    });
  }
});

/* ---------- GET /health ---------- */
app.get("/health", (req, res) => {
  res.json({
    is_success: true,
    official_email: EMAIL,
  });
});

/* ✅ SINGLE export for Vercel */
export default app;
