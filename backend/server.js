require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ===============================
// 🔥 AI EXPLAIN API
// ===============================
app.post("/explain", async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    console.log("📩 Sending to OpenAI...");

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer who explains code clearly and concisely."
        },
        {
          role: "user",
          content: `Explain the following ${language} code in simple terms. Also mention what it does and key logic:\n\n${code}`
        }
      ],
      temperature: 0.5
    });

    const reply = completion.choices[0].message.content;

    res.json({ summary: reply });

  } catch (err) {
    console.error("❌ OpenAI Error:", err.message);

    res.status(500).json({
      error: "AI failed",
      details: err.message
    });
  }
});


// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});