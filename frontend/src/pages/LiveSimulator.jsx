import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import ScanResultPanel from "../components/ScanResultPanel.jsx";
import { ErrorBanner } from "../components/RiskUI.jsx";

const STEPS = [
  "Scanning…",
  "Analyzing content…",
  "Checking links…",
  "Detecting threat indicators…",
  "Generating trust score…",
  "Final result",
];

export default function LiveSimulator() {
  const [scenarios, setScenarios] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listScenarios().then(setScenarios).catch((e) => setError(e.message));
  }, []);

  async function run(id) {
    setActiveId(id);
    setResult(null);
    setError("");
    setStepIndex(0);

    // animate through the scan steps, then fetch the real (rule-based) result
    for (let i = 1; i < STEPS.length - 1; i++) {
      await new Promise((r) => setTimeout(r, 380));
      setStepIndex(i);
    }

    try {
      const res = await api.runScenario(id);
      setStepIndex(STEPS.length - 1);
      setResult(res);
    } catch (e) {
      setError(e.message);
      setStepIndex(-1);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Live Threat Simulator"
        title="Live Threat Simulator"
        description="Pick a scenario to watch TrustShield AI scan, analyze, and score it in real time — using local demo/simulated data, clearly labelled as such."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {scenarios.map((s) => (
          <button
            key={s.id}
            className="panel panel-pad"
            onClick={() => run(s.id)}
            style={{
              textAlign: "left", border: activeId === s.id ? "1px solid var(--verify)" : "1px solid var(--hairline)",
              cursor: "pointer",
            }}
          >
            <div className="text-faint mono" style={{ fontSize: 10.5, textTransform: "uppercase", marginBottom: 8 }}>{s.category}</div>
            <div style={{ fontWeight: 600, fontSize: 14.5 }}>{s.title}</div>
          </button>
        ))}
      </div>

      <ErrorBanner message={error} />

      {stepIndex >= 0 && (
        <div className="panel panel-pad fade-in">
          <div className="flex-col gap-12">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-12" style={{ opacity: i <= stepIndex ? 1 : 0.3 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: `2px solid ${i < stepIndex ? "var(--safe)" : i === stepIndex ? "var(--verify)" : "var(--hairline-bright)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {i < stepIndex && <span style={{ color: "var(--safe)", fontSize: 11 }}>✓</span>}
                </span>
                <span className="mono" style={{ fontSize: 13.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && <ScanResultPanel result={result} simulated />}
    </div>
  );
}
