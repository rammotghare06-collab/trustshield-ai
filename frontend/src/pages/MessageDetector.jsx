import { useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import ScanResultPanel from "../components/ScanResultPanel.jsx";
import { ErrorBanner, LoadingScan } from "../components/RiskUI.jsx";

const SAMPLE = "URGENT! Your bank account will be blocked today. Verify your account immediately by clicking this link: http://sbi-kyc-verify.xyz/update";

export default function MessageDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleScan() {
    if (!text.trim()) {
      setError("Please paste a message to analyze.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.scanMessage(text);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Real Message Detector"
        title="Message & SMS Detector"
        description="Paste any SMS, WhatsApp message, or chat text — in English, Hindi or Hinglish — to check for phishing and scam patterns."
      />

      <div className="panel panel-pad">
        <label className="field-label">Message text</label>
        <textarea
          rows={6}
          placeholder="Paste the message here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-12" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleScan} disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Message"}
          </button>
          <button className="btn btn-ghost" onClick={() => setText(SAMPLE)} disabled={loading}>
            Load sample
          </button>
        </div>
        {loading && <LoadingScan label="Scanning · Analyzing language · Checking links · Scoring trust…" />}
        <ErrorBanner message={error} />
      </div>

      <ScanResultPanel result={result} />
    </div>
  );
}
