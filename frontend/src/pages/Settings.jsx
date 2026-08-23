import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";

export default function Settings() {
  const [language, setLanguage] = useState("en");

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Settings" description="Prototype preferences for the TrustShield AI demo." />

      <div className="panel panel-pad" style={{ marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Language</div>
        <div className="flex gap-12">
          {[
            { id: "en", label: "🇬🇧 English" },
            { id: "hi", label: "🇮🇳 हिंदी" },
            { id: "hinglish", label: "🇮🇳 Hinglish" },
          ].map((opt) => (
            <button
              key={opt.id}
              className="btn"
              onClick={() => setLanguage(opt.id)}
              style={{
                background: language === opt.id ? "linear-gradient(135deg, var(--verify), var(--ai))" : "transparent",
                color: language === opt.id ? "#050810" : "var(--text-hi)",
                border: `1px solid ${language === opt.id ? "transparent" : "var(--hairline-bright)"}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-faint" style={{ fontSize: 12.5, marginTop: 12 }}>
          The Message Detector already auto-detects English, Hindi and Hinglish input regardless of this setting.
        </p>
      </div>

      <div className="panel panel-pad">
        <div className="eyebrow" style={{ marginBottom: 14 }}>About this prototype</div>
        <p className="text-lo" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
          TrustShield AI runs on a local, rule-based risk-analysis engine — no external paid API is required, so
          the app works fully offline for demos. Scan history is stored locally in SQLite.
        </p>
      </div>
    </div>
  );
}
