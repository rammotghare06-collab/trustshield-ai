import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { RiskBadge } from "../components/RiskUI.jsx";

const COLOR_MAP = { TRUSTED: "green", CAUTION: "yellow", SUSPICIOUS: "orange", DANGEROUS: "red" };

export default function ScanHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.history(100).then(setRecords).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleClear() {
    if (!window.confirm("Clear all scan history? This cannot be undone.")) return;
    await api.clearHistory();
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Scan History"
        title="Threat History"
        description="Every message, URL, QR code and email scanned by TrustShield AI, with trust score and risk outcome."
      />

      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <span className="text-lo mono" style={{ fontSize: 12.5 }}>{records.length} record(s)</span>
        <button className="btn btn-ghost" onClick={handleClear} style={{ padding: "8px 16px", fontSize: 13 }}>Clear history</button>
      </div>

      <div className="panel" style={{ overflow: "hidden" }}>
        {loading ? (
          <p className="text-lo" style={{ padding: 24 }}>Loading…</p>
        ) : records.length === 0 ? (
          <p className="text-lo" style={{ padding: 24 }}>No scans yet. Run a scan to see it appear here.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--hairline)" }}>
                {["Date", "Type", "Input", "Score", "Risk", "Result"].map((h) => (
                  <th key={h} className="text-lo" style={{ padding: "14px 20px", fontWeight: 600, fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                  <td style={{ padding: "14px 20px", color: "var(--text-faint)", whiteSpace: "nowrap" }} className="mono">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 20px", textTransform: "uppercase" }} className="mono">{r.scan_type}</td>
                  <td style={{ padding: "14px 20px", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.input_summary}
                  </td>
                  <td style={{ padding: "14px 20px" }} className="mono">{Math.round(r.score)}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <RiskBadge level={r.risk_level} color={COLOR_MAP[r.risk_level] || "green"} />
                  </td>
                  <td style={{ padding: "14px 20px" }}>{r.classification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
