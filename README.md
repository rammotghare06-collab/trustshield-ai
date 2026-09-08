# 🛡️ TrustShield AI

**"Never Trust. Always Verify."**
*"Digital Duniya Mein, Trust Se Pehle Verify."*

An AI-powered digital trust & cybersecurity platform that helps everyday users detect
phishing SMS/WhatsApp messages, scam emails, malicious URLs, and suspicious QR codes —
and explains **why** something is risky, not just that it is 

**"Cybersecurity and Digital Trust."**
---

## What it does

- **Real Message Detector** — paste any SMS/WhatsApp/chat text (English, Hindi or
  Hinglish) and get a Digital Trust Score (0–100), risk level, and a plain-language
  "Why?" explanation.
- **URL Security Scanner** — checks HTTPS, domain reputation, shorteners, typosquatting
  and brand impersonation.
- **Safe QR** — upload a QR code image; it's decoded locally (OpenCV) and the payload is
  analyzed like any other link/message.
- **Email Shield** — analyzes sender, subject and body for phishing and impersonation.
- **Digital Trust Passport** — a premium, at-a-glance verification profile (identity /
  security / reputation / content / behavior) for any scan.
- **Cyber Copilot** — a rule-based assistant that gives safe, defensive guidance
  ("I clicked a phishing link, what do I do?"). It will not help with hacking/exploits.
- **Dashboard & Analytics** — total scans, threats detected, average trust score, 7-day
  trend, and channel/risk breakdowns.
- **Scan History** — every scan logged with score, risk level and outcome.
- **Live Threat Simulator** — a curated, clearly-labelled offline demo dataset (fake
  bank/KYC/lottery/job/delivery scams vs. safe messages) for a smooth hackathon demo,
  even with no internet.

Everything runs on a **local, rule-based heuristic engine** — no paid external API is
required, so the whole app works fully offline.

---

## Architecture

```
trustshield-ai/
├── backend/                 FastAPI + SQLite
│   ├── main.py               API routes
│   ├── ai_engine/            risk analysis engine (modular)
│   │   ├── keywords.py        English/Hindi/Hinglish + fraud term dictionaries
│   │   ├── message_analysis.py
│   │   ├── url_analysis.py
│   │   ├── qr_analysis.py
│   │   ├── email_analysis.py
│   │   ├── risk_scoring.py
│   │   ├── recommendation_engine.py
│   │   ├── trust_score.py     orchestrator (score + passport + recommendation)
│   │   └── copilot.py         rule-based Cyber Copilot
│   ├── database/              SQLAlchemy models + SQLite session (swap-ready for Postgres/MySQL)
│   └── demo_data/scenarios.py Live Threat Simulator dataset
│
└── frontend/                 React (Vite)
    └── src/
        ├── pages/             Dashboard, Message Detector, URL Scanner, Safe QR,
        │                      Email Shield, Trust Passport, Cyber Copilot, Analytics,
        │                      Scan History, Live Simulator, Settings, Landing
        ├── components/        Sidebar, TrustGauge (radar scan gauge), ScanResultPanel,
        │                      TrustPassportCard, RiskUI primitives
        └── api/client.js      backend API wrapper
```

---

## Install & run

### 1. Backend (FastAPI)

```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt --break-system-packages   # drop the flag if using a venv
uvicorn main:app --reload --port 8000
```

Backend runs at **http://127.0.0.1:8000** (docs at `/docs`). SQLite database is created
automatically at `backend/database/trustshield.db` on first run, pre-seeded with sample
scan history.

### 2. Frontend (React + Vite)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://127.0.0.1:5173** and proxies `/api/*` to the backend
automatically (see `vite.config.js`) — no CORS setup needed for local dev.

### 3. Open the app

Visit **http://127.0.0.1:5173** → Landing page → "Scan Now" or "Try Demo".

## Notes

- This is a **defensive** cybersecurity tool only: detection, explanation, and user
  protection. It intentionally does not include any offensive/exploitation tooling, and
  Cyber Copilot refuses hacking-related requests.
- The Live Threat Simulator uses a local, clearly-labelled demo dataset — results from
  the simulator are marked `"simulated": true` and are never presented as real-time
  threat intelligence.
- Database defaults to SQLite for the prototype; swap `DATABASE_URL` in
  `backend/database/db.py` to point at PostgreSQL/MySQL for production.
