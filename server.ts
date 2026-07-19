import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully with API key.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is not defined or is placeholder. Running AI Assistant in offline/local fallback mode.");
}

// System instructions containing core identity, security, safety, and multilingual guidelines
const SYSTEM_INSTRUCTION = `
You are "FIFA Fan Navigator 2026," a highly secure, user-friendly, multilingual AI assistant built to guide international football fans during the tournament.

Core Guidelines:
1. English First Principle: English must always be your primary language for initial greetings or standard layouts. 
2. Multilingual Flexibility: Detect the language of the user's message. If the user types in another language (such as Spanish, French, Japanese, Arabic, German, Hindi, Portuguese, Italian, etc.), dynamically translate your response to match their language. Ensure that key structural or tournament terms (e.g., "Gate Finder", "Transit Options", "East Zone", "North Zone", "Metro Station", "Official FIFA Shuttle Bus") are kept easily recognizable and readable (either in English or as clearly translated headers).
3. Style: Simple, direct, friendly, and highly readable. Travelers are on the move! Use clear bullet points, brief action phrases, and structured formatting.

Features and Safe Guidance:
- STADIUM NAVIGATION & GATES: Help fans find their entry gates based on their ticket zone. Always include a safety reminder: "Always look up at the physical overhead stadium signage to double-check. Never guide fans into restricted, security, or exit-only zones."
- AMENITIES: Help pinpoint restrooms, first-aid stations, concessions (food/beverage), and souvenir shops.
- REAL-TIME TRANSPORTATION: Direct fans to safest official transit options (official FIFA shuttle buses, metro/light rail stations, registered ride-sharing pickup points in Lot C). Strictly advise against taking unregistered, unlicensed, private taxis outside designated official transit zones.

Critical Security & Safety Guardrails:
- NEVER ask for, or accept, personal secrets such as credit card numbers, passwords, or full passport numbers. If the user attempts to enter such data, warn them and refuse to process it.
- EMERGENCY PROTOCOL: If the user mentions any medical emergency, security threat, injury, chest pain, or feeling physically unsafe, you MUST immediately print the official stadium emergency helpline number and instruct them to find the nearest physical stadium steward:
  🚨 EMERGENCY HELPLINE: +1 (800) 555-FIFA (+1 800-555-3432)
  Instruction: Locate the nearest stadium steward, security guard, or stadium staff member immediately! Do not wait.

Keep your responses structured, concise, and safe.
`;

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: ai ? "online" : "local-fallback" });
});

// Chat endpoint proxying to Gemini
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message is required and must be a string." });
    return;
  }

  // Safety Pre-checks (Client can double check, but Server enforces)
  const containsSecrets = /(password|credit\s*card|cvv|pin|passport\s*number|\b[0-9]{13,19}\b)/i.test(message);
  if (containsSecrets) {
    res.json({
      text: "🛡️ **Security Alert**: For your safety, please **do not** enter sensitive personal secrets, passwords, credit card numbers, or passport details. This assistant is secure but does not require personal credentials to guide you.",
      isEmergency: false
    });
    return;
  }

  const isEmergency = /(emergency|injured|hurt|first\s*aid|medical|heart\s*attack|fight|security|stole|bleeding|unconscious|police|ambulance|die|died)/i.test(message);
  if (isEmergency) {
    res.json({
      text: `🚨 **URGENT EMERGENCY ASSISTANCE**

If you or someone near you has a medical emergency or a security issue, please follow these instructions immediately:

1. **Call the Stadium Emergency Helpline**: **+1 (800) 555-FIFA** (or **+1 800-555-3432**) immediately.
2. **Alert Stadium Staff**: Find the nearest physical stadium steward, security officer, or staff member in your vicinity. They are trained to dispatch medical teams instantly.
3. **Stay Calm and Visible**: Remain in a safe area so emergency responders can locate you quickly.

*Si tiene una emergencia médica o de seguridad, busque de inmediato a un personal del estadio o llame al número anterior.*`,
      isEmergency: true
    });
    return;
  }

  // If Gemini API is not initialized, run in local fallback mode
  if (!ai) {
    // Generate simple smart local answers for offline/fallback mode
    let fallbackResponse = "";
    const msgLower = message.toLowerCase();

    if (msgLower.includes("how to use") || msgLower.includes("guide") || msgLower.includes("help")) {
      fallbackResponse = `**How to use FIFA Fan Navigator 2026**:
• **Step 1 ("Where to go")**: Click the **Interactive Map** tab to view the live stadium gates and facilities.
• **Step 2 ("What to open")**: Tap **Gate Finder** to calculate your entrance gate based on your ticket, or tap **Transit Options** to plan a safe route.
• **Step 3 ("Safe Browsing Check")**: Ensure your phone's location access is allowed for direct navigation, and keep an eye on your surroundings while walking.`;
    } else if (msgLower.includes("gate") || msgLower.includes("ticket") || msgLower.includes("entry")) {
      fallbackResponse = `Stadium Gates Guide:
• **North Zone**: Use **Gate A** or **Gate B** (best access to Category 1/3 seating).
• **East Zone**: Use **Gate C** or **Gate D**.
• **South Zone**: Use **Gate E** or **Gate F**.
• **West Zone**: Use **Gate G** or **Gate H**.
• *Always look up at physical overhead stadium signage to double-check. Never enter restricted or exit-only zones.*`;
    } else if (msgLower.includes("restroom") || msgLower.includes("bathroom") || msgLower.includes("toilet") || msgLower.includes("food") || msgLower.includes("concession") || msgLower.includes("beer") || msgLower.includes("shop") || msgLower.includes("store")) {
      fallbackResponse = `Stadium Amenities Guide:
• **Restrooms**: Available near every main sector entry point (Zones North, South, East, West).
• **Concessions**: Food & beverages (including official sponsors) are located on Concourse Level 1 and Level 2.
• **Souvenirs**: Official FIFA stores are located at the West Plaza and East Entry Gate.
• **First Aid**: Stationed near Gate A (North) and Gate E (South).`;
    } else if (msgLower.includes("transport") || msgLower.includes("bus") || msgLower.includes("metro") || msgLower.includes("taxi") || msgLower.includes("uber") || msgLower.includes("shuttle")) {
      fallbackResponse = `Real-Time Transportation Guide:
• **Official FIFA Shuttle Bus**: Operates every 5 minutes from Gates A and E to principal hubs. Safe and fully registered.
• **Metro Station**: 'Arena Central' station is a 10-minute walk via the designated, well-lit pedestrian walkway.
• **Registered Ride-Sharing**: Lot C (North-West) is the only authorized pickup zone.
• *Safety Warning: Avoid taking unregistered, private taxis outside the official zones for your digital and physical safety.*`;
    } else {
      fallbackResponse = `Hello! I am **FIFA Fan Navigator 2026**, currently operating in local fallback mode. 
I can help you find:
1. **Stadium Navigation & Gates** (e.g. type 'gate finder')
2. **Amenities & Concessions** (e.g. type 'restroom' or 'food')
3. **Safe Transportation Routes** (e.g. type 'bus' or 'metro')

*For safety, always look up at physical signage, never enter restricted zones, and avoid unlicensed private taxis.*`;
    }

    res.json({ text: fallbackResponse, isEmergency: false });
    return;
  }

  // Active Gemini Flow
  try {
    // Format history for GoogleGenAI contents structure
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Keep it precise and grounded
      }
    });

    res.json({
      text: response.text || "I am here to guide you. Please let me know how I can help.",
      isEmergency: false
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "AI Assistant experienced an issue. Please try using local shortcuts or toggling Offline Mode." });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
