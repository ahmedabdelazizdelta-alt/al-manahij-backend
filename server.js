import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
  console.warn("⚠️ Warning: GROQ_API_KEY is not set.");
}

// Serve static files from public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

// AI endpoint
app.post("/ai", async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const result = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are an English teacher who explains everything in two parts: (1) simple Arabic explanation for school students, (2) correct English examples and explanation. Friendly style, clear, correct grammar."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    const data = await result.json();
    const reply = data?.choices?.[0]?.message?.content || JSON.stringify(data);

    res.json({ reply });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// Fallback: for SPA routes — serve index.html for any other path
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));