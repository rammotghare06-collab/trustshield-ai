import { Link } from "react-router-dom";
import { ShieldMark } from "../components/Sidebar.jsx";
import TrustGauge from "../components/TrustGauge.jsx";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "22px 48px", borderBottom: "1px solid var(--hairline)",
      }}>
        <div className="flex items-center gap-12">
          <ShieldMark size={30} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>TrustShield AI</span>
        </div>
        <div className="flex gap-16 items-center">
          <Link to="/dashboard" className="btn btn-ghost">Open Dashboard</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: "80px 48px 60px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
        gap: 48, alignItems: "center", maxWidth: 1280, margin: "0 auto",
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 20 }}>Cybersecurity &amp; Digital Trust</div>
          <h1 style={{ fontSize: 54, lineHeight: 1.05, marginBottom: 20 }}>
            Never Trust.<br />Always Verify.
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-lo)", lineHeight: 1.6, maxWidth: 520, marginBottom: 34 }}>
            An AI-powered digital trust platform that detects scams, phishing, malicious
            links and suspicious digital interactions — before they become a threat.
            <br /><br />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--verify)" }}>
              डिजिटल दुनिया में, Trust से पहले Verify.
            </span>
          </p>
          <div className="flex gap-16">
            <Link to="/message-detector" className="btn btn-primary">Scan Now</Link>
            <Link to="/live-simulator" className="btn btn-ghost">Try Demo</Link>
          </div>
        </div>

        <div className="panel panel-pad fade-in" style={{ position: "relative" }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Live sample scan</div>
          <div className="flex gap-24 items-center" style={{ marginBottom: 18 }}>
            <TrustGauge score={12} color="red" size={128} />
            <div>
              <span className="risk-badge risk-red"><span className="risk-dot" />Critical</span>
              <h3 style={{ fontSize: 18, marginTop: 10 }}>PHISHING / FRAUD</h3>
              <p className="text-faint mono" style={{ fontSize: 12, marginTop: 6 }}>7 threat indicators detected</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 16 }}>
            <p className="mono text-lo" style={{ fontSize: 12.5, lineHeight: 1.6 }}>
              "URGENT! Your bank account will be blocked today. Verify immediately: http://sbi-kyc-verify.xyz"
            </p>
          </div>
        </div>
      </section>

      {/* Why TrustShield */}
      <section style={{ padding: "40px 48px 90px", maxWidth: 1280, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, marginBottom: 8 }}>Why TrustShield AI?</h2>
        <p className="text-lo" style={{ marginBottom: 36, maxWidth: 560 }}>
          We don't just detect threats. We explain trust.
        </p>
        <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[
            { title: "Detect", body: "Identify suspicious messages, links, QR codes and emails in seconds." },
            { title: "Understand", body: "See exactly why something is risky — language, links, and behavior." },
            { title: "Verify", body: "Get a Digital Trust Score from 0–100, backed by explainable factors." },
            { title: "Protect", body: "Receive clear, actionable steps to stay safe from the threat." },
          ].map((f) => (
            <div className="panel panel-pad" key={f.title}>
              <h3 style={{ fontSize: 17, marginBottom: 10, color: "var(--verify)" }}>{f.title}</h3>
              <p className="text-lo" style={{ fontSize: 13.5, lineHeight: 1.55 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: "24px 48px", borderTop: "1px solid var(--hairline)", textAlign: "center" }}>
        <p className="text-faint mono" style={{ fontSize: 12 }}>TrustShield AI — hackathon prototype · runs fully offline on local heuristic intelligence</p>
      </footer>
    </div>
  );
}
