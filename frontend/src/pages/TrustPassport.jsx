import { useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { ErrorBanner, LoadingScan } from "../components/RiskUI.jsx";

const riskConfig = {
  TRUSTED: {
    icon: "✓",
    label: "VERIFIED",
    sub: "No significant security threats detected",
    className: "passport-trusted",
  },
  CAUTION: {
    icon: "!",
    label: "CAUTION",
    sub: "Some security concerns were detected",
    className: "passport-caution",
  },
  SUSPICIOUS: {
    icon: "!",
    label: "SUSPICIOUS",
    sub: "Multiple suspicious indicators detected",
    className: "passport-suspicious",
  },
  DANGEROUS: {
    icon: "×",
    label: "DANGEROUS",
    sub: "High-risk or malicious indicators detected",
    className: "passport-dangerous",
  },
};

function getRisk(level) {
  return riskConfig[level] || riskConfig.CAUTION;
}

function getPassportItem(passport, key, fallback) {
  if (!passport) return fallback;

  const value = passport[key];

  if (!value) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return (
      value.description ||
      value.message ||
      value.status ||
      value.detail ||
      fallback
    );
  }

  return fallback;
}

export default function TrustPassport() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const value = input.trim();

    if (!value) {
      setError("Enter a URL or message to generate a trust passport.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const looksLikeUrl =
        /^(https?:\/\/|www\.)/i.test(value) ||
        /^[a-z0-9-]+\.[a-z]{2,}/i.test(value);

      const res = looksLikeUrl
        ? await api.scanUrl(value)
        : await api.scanMessage(value);

      setResult(res);
    } catch (e) {
      console.error("Trust Passport error:", e);
      setError(e?.message || "Unable to generate Trust Passport.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  }

  const risk = result ? getRisk(result.risk_level) : null;
  const passport = result?.trust_passport || {};

  return (
    <div className="trust-passport-page">
      <PageHeader
        eyebrow="Digital Trust Passport"
        title="Verify Before You Trust"
        description="Turn any message, URL or digital identity into a security passport — identity, reputation, content and behavior in one verification profile."
      />

      {/* =========================================================
          INPUT AREA
      ========================================================= */}

      <section className="passport-input-card">
        <div className="passport-input-top">
          <div className="passport-input-icon">◎</div>

          <div>
            <div className="passport-input-title">
              Digital Identity Input
            </div>

            <div className="passport-input-subtitle">
              Paste a URL or message for security verification.
            </div>
          </div>

          <div className="passport-counter">
            {input.length}/1000
          </div>
        </div>

        <textarea
          className="passport-textarea"
          rows={6}
          maxLength={1000}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a suspicious message, website URL or digital link here..."
        />

        <div className="passport-input-bottom">
          <span className="passport-shortcut">
            Ctrl + Enter to verify
          </span>

          <button
            className="passport-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Generate Passport →"}
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: 18 }}>
            <LoadingScan label="Building digital trust profile..." />
          </div>
        )}

        <ErrorBanner message={error} />
      </section>

      {/* =========================================================
          RESULT
      ========================================================= */}

      {result && (
        <div className="passport-results fade-in">

          {/* =====================================================
              STATUS HERO
          ===================================================== */}

          <section className={`passport-status ${risk.className}`}>
            <div className="passport-status-left">

              <div className="passport-status-orbit">
                <div className="passport-status-icon">
                  {risk.icon}
                </div>
              </div>

              <div>
                <div className="passport-status-eyebrow">
                  VERIFICATION STATUS
                </div>

                <h2>{risk.label}</h2>

                <p>{risk.sub}</p>
              </div>
            </div>

            <div className="passport-status-score">
              <span>TRUST SCORE</span>

              <strong>
                {Math.round(result.score || 0)}
              </strong>

              <small>/100</small>
            </div>
          </section>

          {/* =====================================================
              METRIC CARDS
          ===================================================== */}

          <section className="passport-metrics">

            <div className="passport-metric-card">
              <div className="metric-label">
                TRUST SCORE
              </div>

              <div className="metric-score-row">
                <div className="mini-score-ring">
                  <div>
                    <strong>
                      {Math.round(result.score || 0)}
                    </strong>
                    <span>/100</span>
                  </div>
                </div>

                <div>
                  <strong className="metric-big">
                    {Math.round(result.score || 0)}/100
                  </strong>

                  <p>Trust level</p>
                </div>
              </div>
            </div>

            <div className="passport-metric-card">
              <div className="metric-label">
                SCAN TYPE
              </div>

              <div className="metric-main">
                <span className="metric-icon">
                  {result.scan_type === "url" ? "◉" : "●"}
                </span>

                <div>
                  <strong>
                    {(result.scan_type || "message").toUpperCase()}
                  </strong>

                  <p>Analyzed channel</p>
                </div>
              </div>
            </div>

            <div className="passport-metric-card">
              <div className="metric-label">
                AI CONFIDENCE
              </div>

              <strong className="confidence-number">
                {Math.round(result.confidence || 0)}%
              </strong>

              <p>Analysis confidence</p>
            </div>

            <div className="passport-metric-card">
              <div className="metric-label">
                SECURITY INDICATORS
              </div>

              <strong className="confidence-number">
                {result.indicator_count || 0}
              </strong>

              <p>Detected signals</p>
            </div>

          </section>

          {/* =====================================================
              ORIGINAL INPUT
          ===================================================== */}

          <section className="passport-original">

            <div className="original-header">
              <div>
                <span className="section-kicker">
                  SCANNED CONTENT
                </span>

                <h3>Original Input</h3>
              </div>

              <span className="analyzed-badge">
                ANALYZED
              </span>
            </div>

            <div className="original-content">
              {result.full_input ||
                result.input_summary ||
                input ||
                "No input available."}
            </div>

          </section>

          {/* =====================================================
              TRUST PASSPORT
          ===================================================== */}

          <section className="passport-profile">

            <div className="profile-header">

              <div>
                <span className="section-kicker">
                  VERIFIED SECURITY PROFILE
                </span>

                <h2>Digital Trust Passport</h2>

                <p>
                  A security identity card generated from the
                  scanned content.
                </p>
              </div>

              <div className="passport-id">
                <span>PASSPORT ID</span>
                <strong>
                  TS-{String(result.id || "LIVE")
                    .toString()
                    .slice(0, 8)
                    .toUpperCase()}
                </strong>
              </div>

            </div>

            <div className="passport-profile-score">
              <div className="profile-score-number">
                {Math.round(result.score || 0)}
                <small>/100</small>
              </div>

              <div>
                <span>OVERALL TRUST</span>

                <strong>
                  {risk.label}
                </strong>
              </div>
            </div>

            <div className="verification-grid">

              <VerificationRow
                icon="◈"
                title="IDENTITY"
                text={getPassportItem(
                  passport,
                  "identity",
                  "Identity could not be fully verified."
                )}
                good={
                  (result.score || 0) >= 70
                }
              />

              <VerificationRow
                icon="◆"
                title="SECURITY"
                text={getPassportItem(
                  passport,
                  "security",
                  result.scan_type === "url"
                    ? "Security characteristics analyzed."
                    : "Message security characteristics analyzed."
                )}
                good={
                  (result.score || 0) >= 70
                }
              />

              <VerificationRow
                icon="◎"
                title="REPUTATION"
                text={getPassportItem(
                  passport,
                  "reputation",
                  "Reputation signals analyzed by TrustShield AI."
                )}
                good={
                  (result.score || 0) >= 70
                }
              />

              <VerificationRow
                icon="◇"
                title="CONTENT"
                text={getPassportItem(
                  passport,
                  "content",
                  `${result.indicator_count || 0} security indicator(s) detected.`
                )}
                good={
                  (result.indicator_count || 0) === 0
                }
              />

              <VerificationRow
                icon="◌"
                title="BEHAVIOR"
                text={getPassportItem(
                  passport,
                  "behavior",
                  "No suspicious behavior information available."
                )}
                good={
                  (result.score || 0) >= 70
                }
              />

            </div>

          </section>

          {/* =====================================================
              FINAL VERDICT
          ===================================================== */}

          <section className={`passport-verdict ${risk.className}`}>

            <div className="verdict-icon">
              {risk.icon}
            </div>

            <div>
              <span>TRUSTSHIELD AI VERDICT</span>

              <h3>
                {result.classification || risk.label}
              </h3>

              <p>
                This passport was generated using the TrustShield
                AI security analysis engine.
              </p>
            </div>

            <div className="verdict-score">
              {Math.round(result.score || 0)}
              <small>/100</small>
            </div>

          </section>

        </div>
      )}

      {/* =========================================================
          PAGE CSS
      ========================================================= */}

      <style>{`

        .trust-passport-page {
          width: 100%;
          padding-bottom: 70px;
        }

        /* INPUT */

        .passport-input-card {
          margin-top: 26px;
          padding: 28px;
          border: 1px solid rgba(54, 220, 205, 0.35);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(79, 70, 229, 0.13),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              rgba(5, 25, 43, 0.96),
              rgba(8, 18, 35, 0.98)
            );
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.15),
            0 25px 70px rgba(0,0,0,0.28);
        }

        .passport-input-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .passport-input-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #27e0d0;
          background: rgba(25, 211, 195, 0.1);
          border: 1px solid rgba(25, 211, 195, 0.3);
          font-size: 22px;
        }

        .passport-input-title {
          font-size: 15px;
          font-weight: 700;
        }

        .passport-input-subtitle {
          margin-top: 4px;
          color: var(--text-faint);
          font-size: 12px;
        }

        .passport-counter {
          margin-left: auto;
          color: #8495b5;
          font-family: monospace;
          font-size: 12px;
        }

        .passport-textarea {
          width: 100%;
          box-sizing: border-box;
          resize: vertical;
          min-height: 150px;
          padding: 18px;
          border-radius: 15px;
          border: 1px solid rgba(120,140,170,0.22);
          background: #030914;
          color: #f4f7ff;
          outline: none;
          font-family: monospace;
          font-size: 14px;
          line-height: 1.65;
        }

        .passport-textarea:focus {
          border-color: rgba(39,224,208,0.65);
          box-shadow: 0 0 0 3px rgba(39,224,208,0.08);
        }

        .passport-input-bottom {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .passport-shortcut {
          color: #7184a6;
          font-family: monospace;
          font-size: 12px;
        }

        .passport-generate-btn {
          border: 0;
          border-radius: 14px;
          padding: 14px 25px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          color: #06111d;
          background: linear-gradient(
            110deg,
            #31d8ce,
            #667eea
          );
          box-shadow:
            0 12px 30px rgba(42, 216, 207, 0.18);
          transition: 0.2s ease;
        }

        .passport-generate-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 15px 35px rgba(42, 216, 207, 0.28);
        }

        .passport-generate-btn:disabled {
          opacity: 0.6;
          cursor: wait;
          transform: none;
        }

        /* RESULTS */

        .passport-results {
          margin-top: 28px;
        }

        .passport-status {
          min-height: 145px;
          border-radius: 24px;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(
            120deg,
            rgba(20,31,53,0.98),
            rgba(10,18,32,0.98)
          );
          box-shadow: 0 25px 65px rgba(0,0,0,0.22);
        }

        .passport-status-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .passport-status-orbit {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          padding: 7px;
          background:
            conic-gradient(
              #2dd4bf,
              #667eea,
              transparent,
              #2dd4bf
            );
          animation: passportSpin 6s linear infinite;
        }

        .passport-status-icon {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b1425;
          font-size: 32px;
          font-weight: 900;
          animation: passportCounterSpin 6s linear infinite;
        }

        @keyframes passportSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes passportCounterSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .passport-status-eyebrow {
          color: #7889a9;
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
        }

        .passport-status h2 {
          margin: 5px 0;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .passport-status p {
          margin: 0;
          color: #93a3bf;
          font-size: 13px;
        }

        .passport-status-score {
          text-align: right;
        }

        .passport-status-score span {
          display: block;
          color: #7385a4;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .passport-status-score strong {
          font-size: 52px;
          line-height: 1;
        }

        .passport-status-score small {
          color: #8190aa;
        }

        /* COLORS */

        .passport-trusted {
          --passport-accent: #31d7a5;
        }

        .passport-caution {
          --passport-accent: #f5c451;
        }

        .passport-suspicious {
          --passport-accent: #ff9d4d;
        }

        .passport-dangerous {
          --passport-accent: #ff626d;
        }

        .passport-status {
          border-color: color-mix(
            in srgb,
            var(--passport-accent) 28%,
            transparent
          );
        }

        .passport-status-icon,
        .passport-status h2,
        .passport-status-score strong {
          color: var(--passport-accent);
        }

        /* METRICS */

        .passport-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .passport-metric-card {
          padding: 22px;
          min-height: 145px;
          border-radius: 18px;
          border: 1px solid rgba(110,130,165,0.13);
          background: rgba(16,27,48,0.82);
        }

        .metric-label {
          color: #7183a3;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.09em;
          margin-bottom: 18px;
        }

        .metric-main {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .metric-main strong {
          font-size: 17px;
        }

        .metric-main p,
        .passport-metric-card p {
          margin: 4px 0 0;
          color: #72829f;
          font-size: 12px;
        }

        .metric-icon {
          font-size: 30px;
          color: #8b8df6;
        }

        .metric-score-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mini-score-ring {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle,
              #101b30 56%,
              transparent 58%
            ),
            conic-gradient(
              #31d7a5,
              #667eea,
              #17253e
            );
        }

        .mini-score-ring strong {
          font-size: 16px;
        }

        .mini-score-ring span {
          color: #7183a1;
          font-size: 9px;
        }

        .metric-big {
          font-size: 18px;
        }

        .confidence-number {
          display: block;
          font-size: 34px;
          line-height: 1;
        }

        /* ORIGINAL */

        .passport-original {
          margin-top: 16px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(110,130,165,0.13);
          background: #0e182b;
        }

        .original-header {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(110,130,165,0.13);
        }

        .section-kicker {
          color: #55ddd2;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        .original-header h3 {
          margin: 5px 0 0;
          font-size: 16px;
        }

        .analyzed-badge {
          height: fit-content;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(80,100,130,0.25);
          color: #8392ae;
          font-family: monospace;
          font-size: 9px;
        }

        .original-content {
          padding: 22px 24px;
          color: #c6d0e2;
          font-family: monospace;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* PROFILE */

        .passport-profile {
          margin-top: 22px;
          border-radius: 25px;
          overflow: hidden;
          border: 1px solid rgba(91,160,183,0.2);
          background:
            linear-gradient(
              135deg,
              rgba(11,40,55,0.95),
              rgba(17,28,50,0.98) 42%,
              rgba(9,17,31,0.98)
            );
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
        }

        .profile-header {
          padding: 26px 28px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(100,130,160,0.13);
        }

        .profile-header h2 {
          margin: 7px 0 4px;
          font-size: 24px;
        }

        .profile-header p {
          margin: 0;
          color: #8292ac;
          font-size: 12px;
        }

        .passport-id {
          text-align: right;
        }

        .passport-id span {
          display: block;
          color: #62738f;
          font-family: monospace;
          font-size: 9px;
        }

        .passport-id strong {
          display: block;
          margin-top: 5px;
          color: #aebbd0;
          font-family: monospace;
          font-size: 12px;
        }

        .passport-profile-score {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 24px 28px;
          background: rgba(0,0,0,0.12);
        }

        .profile-score-number {
          font-size: 44px;
          font-weight: 800;
        }

        .profile-score-number small {
          color: #7183a0;
          font-size: 14px;
        }

        .passport-profile-score span {
          display: block;
          color: #657895;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
        }

        .passport-profile-score strong {
          display: block;
          margin-top: 5px;
          color: #dce6f7;
          font-size: 14px;
        }

        .verification-grid {
          padding: 0 28px 25px;
        }

        .verification-row {
          display: grid;
          grid-template-columns: 35px 130px 1fr;
          align-items: center;
          min-height: 64px;
          border-bottom: 1px solid rgba(110,130,165,0.11);
        }

        .verification-row:last-child {
          border-bottom: 0;
        }

        .verification-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          font-size: 12px;
          background: rgba(49,215,165,0.12);
          color: #31d7a5;
        }

        .verification-row.warning .verification-icon {
          background: rgba(255,181,70,0.12);
          color: #ffb546;
        }

        .verification-title {
          color: #8ea0bc;
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
        }

        .verification-text {
          text-align: right;
          color: #d7e0ef;
          font-size: 13px;
        }

        /* VERDICT */

        .passport-verdict {
          margin-top: 18px;
          padding: 22px 25px;
          display: flex;
          align-items: center;
          gap: 17px;
          border-radius: 18px;
          border: 1px solid color-mix(
            in srgb,
            var(--passport-accent) 25%,
            transparent
          );
          background: rgba(15,24,42,0.9);
        }

        .verdict-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          color: var(--passport-accent);
          background: color-mix(
            in srgb,
            var(--passport-accent) 10%,
            transparent
          );
          font-size: 22px;
          font-weight: 900;
        }

        .passport-verdict span {
          color: #687995;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
        }

        .passport-verdict h3 {
          margin: 4px 0;
          color: var(--passport-accent);
          font-size: 17px;
        }

        .passport-verdict p {
          margin: 0;
          color: #7889a4;
          font-size: 11px;
        }

        .verdict-score {
          margin-left: auto;
          font-size: 30px;
          font-weight: 800;
          color: var(--passport-accent);
        }

        .verdict-score small {
          color: #71819d;
          font-size: 11px;
        }

        /* MOBILE */

        @media (max-width: 1000px) {
          .passport-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .passport-input-card {
            padding: 18px;
          }

          .passport-status {
            padding: 22px;
            flex-direction: column;
            align-items: flex-start;
            gap: 25px;
          }

          .passport-status-score {
            text-align: left;
          }

          .passport-metrics {
            grid-template-columns: 1fr;
          }

          .profile-header {
            flex-direction: column;
            gap: 20px;
          }

          .passport-id {
            text-align: left;
          }

          .verification-row {
            grid-template-columns: 30px 100px 1fr;
          }

          .verification-text {
            font-size: 11px;
          }

          .passport-input-bottom {
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
          }

          .passport-generate-btn {
            width: 100%;
          }

          .passport-shortcut {
            text-align: center;
          }

          .passport-verdict {
            align-items: flex-start;
          }

          .verdict-score {
            display: none;
          }
        }

      `}</style>
    </div>
  );
}

/* =============================================================
   VERIFICATION ROW
============================================================= */

function VerificationRow({
  icon,
  title,
  text,
  good,
}) {
  return (
    <div
      className={`verification-row ${
        good ? "" : "warning"
      }`}
    >
      <div className="verification-icon">
        {good ? "✓" : "!"}
      </div>

      <div className="verification-title">
        {title}
      </div>

      <div className="verification-text">
        {text}
      </div>
    </div>
  );
}