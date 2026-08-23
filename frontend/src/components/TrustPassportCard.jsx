const ROWS = [
  { key: "identity", label: "Identity" },
  { key: "security", label: "Security" },
  { key: "reputation", label: "Reputation" },
  { key: "content", label: "Content" },
  { key: "behavior", label: "Behavior" },
];

export default function TrustPassportCard({ passport, scanType }) {
  if (!passport) return null;

  return (
    <div className="panel" style={{
      padding: 0, overflow: "hidden",
      border: "1px solid var(--hairline-bright)",
    }}>
      <div style={{
        padding: "20px 26px",
        background: "linear-gradient(120deg, rgba(51,214,192,0.14), rgba(124,124,255,0.08))",
        borderBottom: "1px solid var(--hairline)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div className="eyebrow">Digital Trust Passport</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, marginTop: 6 }}>
            Scan Verification Profile
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 28, fontWeight: 700 }}>{passport.trust_score}<span style={{ fontSize: 14, color: "var(--text-faint)" }}>/100</span></div>
          <div className="mono text-faint" style={{ fontSize: 11 }}>RISK: {passport.risk_summary}</div>
        </div>
      </div>

      <div style={{ padding: "10px 26px 22px" }}>
        {ROWS.map((row) => {
          const item = passport[row.key];
          if (!item) return null;
          return (
            <div key={row.key} className="indicator-row" style={{ alignItems: "center" }}>
              <span style={{ fontSize: 16, color: item.ok ? "var(--safe)" : "var(--danger)" }}>
                {item.ok ? "✅" : "⚠️"}
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 12 }}>
                <span className="text-lo" style={{ fontSize: 12.5, minWidth: 90, textTransform: "uppercase", letterSpacing: "0.04em" }}>{row.label}</span>
                <span style={{ fontSize: 14, textAlign: "right" }}>{item.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
