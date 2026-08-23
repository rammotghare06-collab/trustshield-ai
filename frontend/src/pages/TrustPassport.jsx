import { useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import TrustPassportCard from "../components/TrustPassportCard.jsx";
import TrustGauge from "../components/TrustGauge.jsx";
import { ErrorBanner, LoadingScan } from "../components/RiskUI.jsx";

export default function TrustPassport() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!input.trim()) {
      setError("Enter a URL or message to generate a passport.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const looksLikeUrl = /^https?:\/\/|^www\.|^[a-z0-9-]+\.[a-z]{2,}/i.test(input.trim()) && !input.includes(" ");
      const res = looksLikeUrl ? await api.scanUrl(input) : await api.scanMessage(input);
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
        eyebrow="Digital Trust Passport"
        title="Generate a Trust Passport"
        description="A premium, at-a-glance verification profile for any scanned website, message or link — identity, security, reputation, content and behavior in one card."
      />

      <div className="panel panel-pad">
        <label className="field-label">URL or message</label>
        <textarea rows={3} placeholder="Paste a URL or message…" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="flex gap-12" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating…" : "Generate Passport"}
          </button>
        </div>
        {loading && <LoadingScan label="Building trust profile…" />}
        <ErrorBanner message={error} />
      </div>

      {result && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          <div className="panel panel-pad flex items-center gap-24" style={{ marginBottom: 20 }}>
            <TrustGauge score={result.score} color={result.color} size={120} />
            <div>
              <h3 style={{ fontSize: 20 }}>{result.classification}</h3>
              <p className="text-lo mono" style={{ fontSize: 12.5, marginTop: 6 }}>{result.indicator_count} indicators · {result.confidence}% confidence</p>
            </div>
          </div>
          <TrustPassportCard passport={result.trust_passport} scanType={result.scan_type} />
        </div>
      )}
    </div>
  );
}
