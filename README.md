 🌌 Unified Intelligence | Next-Gen AI Triage Portal

Unified Intelligence is a production-ready, AI-native incident response platform designed to automate the chaos of customer support and internal ticketing. Powered by Gemini 2.5 Flash, it transforms raw complaints into structured, actionable intelligence in sub-400ms.


🚀 The Tech Stack (MERN-AI)
Frontend: React.js + Vite (Lightning-fast ESM bundling)
Backend: Node.js + Express (Serverless-optimized via Vercel)
* **Database:** MongoDB Atlas (Cloud-native persistence)
* **AI Engine:** Google Gemini 2.5 Flash (Advanced NLP & Sentiment Analysis)
* **Identity:** Clerk Auth (Enterprise-grade security)
* **Styling:** Tailwind CSS (Modern Glassmorphism UI)

---

## 🛠️ Key Features & USPs

### 1. **Automated Triage Orchestration**
Instead of manual tagging, the system uses **Gemini 2.5 Flash** to instantly categorize tickets, assign priority, and calculate SLA deadlines based on the severity of the text.

### 2. **360° AI Intelligence Layer**
A dedicated transparency module that reveals the "AI's thought process," providing:
* **Internal Analysis:** Deep-dive into why the AI assigned a specific priority.
* **Sentiment Tracking:** Real-time mood detection of the user.
* **Suggested Resolution:** Context-aware draft replies to reduce human response time by 90%.

### 3. **Atomic Escalation Protocol**
A fail-safe mechanism that bypasses automated triage for high-risk cases, ensuring immediate senior management notification for critical SLA breaches.

### 4. **Zero-Trust Security**
Fully integrated with **Clerk Auth**, supporting Social OAuth (Google/LinkedIn) and leaked-password protection to ensure only authorized operators access the Command Center.

---

## 📦 Installation & Setup

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/yashpandey0229-developer/unified-intelligence.git
   cd unified-intelligence
   ```

2. **Install Dependencies:**
   ```bash
   # Install root, client, and server deps
   npm install && cd client && npm install && cd ../server && npm install
   ```

3. **Environment Variables:**
   Create a `.env` in the `server` folder:
   ```env
   MONGO_URI=your_mongodb_uri
   GEMINI_API_KEY=your_google_ai_key
   CLERK_SECRET_KEY=your_clerk_key
   ```

4. **Run Development:**
   ```bash
   # From root
   npm run dev
   ```

---

## 🌐 Deployment Logic
The project is optimized for **Vercel Monorepo Deployment**. The `vercel.json` manifest handles the reverse-proxy tunneling, decoupling the static frontend from the serverless Node.js runtime.

---

### 👨‍💻 Developed By
Yash Pandey
B.Tech Student | Galgotias University
*Specializing in AI-Integrated Web Systems*

