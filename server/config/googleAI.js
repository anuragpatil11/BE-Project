const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// DO NOT put "models/gemini-pro" — use just "gemini-pro"
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

module.exports = model;
