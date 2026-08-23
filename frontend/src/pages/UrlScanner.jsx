import { useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import ScanResultPanel from "../components/ScanResultPanel.jsx";
import { ErrorBanner, LoadingScan } from "../components/RiskUI.jsx";

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleScan() {
    if (!url.trim()) {
      setError("Please enter a URL to analyze.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.scanUrl(url);
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
        eyebrow="URL Security Scanner"
        title="Website & Link Scanner"
        description="Check any link for HTTPS, domain reputation, typosquatting, shorteners and brand impersonation."
      />

      <div className="panel panel-pad">
        <label className="field-label">URL</label>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
        />
        <div className="flex gap-12" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleScan} disabled={loading}>
            {loading ? "Scanning…" : "Scan URL"}
          </button>
          <button className="btn btn-ghost" onClick={() => setUrl("http://sbi-kyc-verify.xyz/update")} disabled={loading}>
            Try a risky example
          </button>
        </div>
        {loading && <LoadingScan label="Resolving domain · Checking HTTPS · Checking reputation…" />}
        <ErrorBanner message={error} />
      </div>

      <ScanResultPanel result={result} />
    </div>
  );
}
