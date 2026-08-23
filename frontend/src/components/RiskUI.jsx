export function RiskBadge({ level, color }) {
  return (
    <span className={`risk-badge risk-${color}`}>
      <span className="risk-dot" />
      {level}
    </span>
  );
}

export function IndicatorList({ indicators }) {
  if (!indicators || indicators.length === 0) {
    return <p className="text-lo" style={{ fontSize: 14 }}>No specific threat indicators detected.</p>;
  }
  return (
    <div>
      {indicators.map((ind, i) => (
        <div className="indicator-row" key={i}>
          <span className={`severity-chip sev-${ind.severity}`}>{ind.severity}</span>
          <span>{ind.label}</span>
        </div>
      ))}
    </div>
  );
}

export function StatCard({ label, value, sub, accent }) {
  return (
    <div className="panel panel-pad" style={{ minWidth: 0 }}>
      <div className="text-lo" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: accent || "var(--text-hi)" }}>
        {value}
      </div>
      {sub && <div className="text-faint" style={{ fontSize: 12.5, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "var(--danger-bg)", border: "1px solid rgba(248,113,113,0.35)",
      color: "var(--danger)", borderRadius: 12, padding: "12px 16px", fontSize: 14, marginTop: 16,
    }}>
      {message}
    </div>
  );
}

export function LoadingScan({ label = "Analyzing…" }) {
  return (
    <div className="flex items-center gap-12" style={{ padding: "20px 0", color: "var(--verify)" }}>
      <span style={{
        width: 16, height: 16, borderRadius: "50%",
        border: "2px solid var(--hairline-bright)", borderTopColor: "var(--verify)",
        animation: "spin 0.8s linear infinite", display: "inline-block",
      }} />
      <span className="mono" style={{ fontSize: 13 }}>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
