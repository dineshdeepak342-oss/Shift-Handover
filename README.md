# ShiftFlow AI — Shift Handover Note Generator

> **Never lose critical shift context again.**  
> ShiftFlow AI turns tickets, incidents, chat messages, and git commits into structured, source-grounded shift handover notes for support teams, NOC teams, DevOps teams, and on-call engineers.

---

## 🌟 Key Features

- **Shift-Window Filtering**: Isolate events within exact timestamp boundaries `[shift_start, shift_end)`.
- **Source-Grounded Notes**: Every item links directly to ticket IDs, commit hashes, or incident URLs. Zero generic or fake tasks.
- **Automatic Deduplication**: Merges multiple updates for the same record `(source, record_id)` into a single item using the latest status.
- **4 Structured Sections**:
  1. **Completed**
  2. **In Progress**
  3. **Blockers / Escalations**
  4. **Watch-list**
- **Multi-Format Export**: Executive-ready PDF export via jsPDF, Slack markdown summary generator, and DOCX export.
- **Reproducible Logic**: Deterministic processing pipeline guarantees identical note output for the same input window.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 / 19 (Vite)
- **Styling**: Tailwind CSS v3 (Custom Dark Navy `#0a0f1e` color system)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Exports**: jsPDF & html2canvas
- **Data Persistence**: `localStorage` authentication & workspace session state

---

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173/`

---

## 🔐 Security Notice

API keys and third-party integration secrets are never hardcoded. All production deployments must inject credentials via secure environment variables.
