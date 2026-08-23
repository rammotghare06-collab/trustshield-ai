import { useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import ScanResultPanel from "../components/ScanResultPanel.jsx";
import { ErrorBanner, LoadingScan } from "../components/RiskUI.jsx";

export default function EmailShield() {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleScan() {
    if (!body.trim()) {
      setError("Please paste the email body to analyze.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.scanEmail(sender, subject, body);
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
        eyebrow="Email Shield"
        title="Email Security Analyzer"
        description="Paste an email's sender, subject and body to check for phishing, impersonation and financial-fraud indicators."
      />

      <div className="panel panel-pad flex-col gap-16">
        <div>
          <label className="field-label">Sender (optional)</label>
          <input type="text" placeholder="e.g. support@hdfcbank-alerts.com" value={sender} onChange={(e) => setSender(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Subject (optional)</label>
          <input type="text" placeholder="e.g. Update your KYC now" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Email body</label>
          <textarea rows={7} placeholder="Paste the email body here…" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="flex gap-12">
          <button className="btn btn-primary" onClick={handleScan} disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Email"}
          </button>
        </div>
        {loading && <LoadingScan label="Checking sender · Scanning content · Checking links…" />}
        <ErrorBanner message={error} />
      </div>

      <ScanResultPanel result={result} />
    </div>
  );
}
