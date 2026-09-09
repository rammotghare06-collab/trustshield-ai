import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="landing-page">

      <header className="landing-header">
        <div className="landing-brand">
          <div className="landing-logo">
  <svg
    className="trustshield-logo"
    viewBox="0 0 64 72"
    fill="none"
  >
    <path
      d="M32 4L56 13V34C56 50 47 62 32 68C17 62 8 50 8 34V13L32 4Z"
      fill="#0D1728"
      stroke="url(#shieldGradient)"
      strokeWidth="2.5"
    />

    <path
      d="M21 36L28 43L44 27"
      stroke="#33D6C0"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <defs>
      <linearGradient
        id="shieldGradient"
        x1="8"
        y1="4"
        x2="56"
        y2="68"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33D6C0" />
        <stop offset="1" stopColor="#6C6CFF" />
      </linearGradient>
    </defs>
  </svg>
</div>

          <div>
            <div className="brand-name">TrustShield AI</div>
            <div className="brand-status">
              <span className="status-dot" />
              DIGITAL TRUST ENGINE
            </div>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="landing-dashboard-btn"
        >
          Open Dashboard ↗
        </Link>
      </header>


      <section className="landing-hero">

        <div className="hero-copy">

          <div className="hero-eyebrow">
            <span className="live-dot" />
            CYBERSECURITY · AI · DIGITAL TRUST
          </div>

          <h1>
            Never Trust.
            <br />
            <span>Always Verify.</span>
          </h1>

          <p className="hero-description">
            An AI-powered digital trust platform that detects
            scams, phishing, malicious links and suspicious
            digital interactions — before they become a threat.
          </p>

          <p className="hero-hindi">
            डिजिटल दुनिया में,{" "}
            <strong>Trust से पहले Verify.</strong>
          </p>

          <div className="hero-actions">
            <Link
              to="/message-detector"
              className="hero-primary-btn"
            >
              Scan Now →
            </Link>

            <Link
              to="/live-simulator"
              className="hero-secondary-btn"
            >
              Try Demo ↗
            </Link>
          </div>

        </div>


        {/* SECURITY CORE */}

        <div className="hero-3d-area">

          <div className="core-label">
            <span className="live-dot" />
            TRUSTSHIELD SECURITY CORE
          </div>

          <div className="core-system">

            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />

            <div className="radar-ring">
              <div className="radar-line" />
            </div>

            <div className="core-node node-email">
              <div className="node-icon">✉</div>
              EMAIL
            </div>

            <div className="core-node node-url">
              <div className="node-icon">↗</div>
              URL
            </div>

            <div className="core-node node-qr">
              <div className="node-icon">▦</div>
              QR
            </div>

            <div className="core-node node-sms">
              <div className="node-icon">▢</div>
              SMS
            </div>


            {/* MAIN SHIELD */}

<div className="shield-3d">

  <div className="shield-symbol">

    <svg
      className="core-trustshield-logo"
      viewBox="0 0 64 72"
      fill="none"
    >
      <path
        d="M32 4L56 13V34C56 50 47 62 32 68C17 62 8 50 8 34V13L32 4Z"
        fill="#0D1728"
        stroke="url(#coreShieldGradient)"
        strokeWidth="2.5"
      />

      <path
        d="M21 36L28 43L44 27"
        stroke="#33D6C0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="coreShieldGradient"
          x1="8"
          y1="4"
          x2="56"
          y2="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#33D6C0" />
          <stop offset="1" stopColor="#6C6CFF" />
        </linearGradient>
      </defs>
    </svg>

  </div>

  <div className="shield-ai">
    AI
  </div>

</div>
            <div className="core-score">

              <div className="score-label">
                GLOBAL TRUST SCORE
              </div>

              <div className="score-number">
                87<span>/100</span>
              </div>

              <div className="score-status">
                <span className="live-dot" />
                SYSTEM PROTECTED
              </div>

            </div>


            <div className="floating-card card-scans">
              <div>TOTAL SCANS</div>
              <strong>1,284</strong>
            </div>


            <div className="floating-card card-threats">
              <div>THREATS</div>
              <strong>143</strong>
            </div>


            <div className="floating-card card-safe">
              <div>SAFE</div>
              <strong>1,141</strong>
            </div>


            <div className="threat-alert">

              <div className="threat-alert-icon">
                !
              </div>

              <div>
                <strong>THREAT DETECTED</strong>
                <p>Phishing indicator blocked</p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* SCANNERS */}

      <section className="scanner-section">

        <div className="scanner-heading">

          <div className="hero-eyebrow">
            <span className="live-dot" />
            MULTI-LAYER THREAT DETECTION
          </div>

          <h2>
            Scan Before You <span>Trust.</span>
          </h2>

          <p>
            Protect yourself from suspicious emails, messages,
            websites and QR codes with one intelligent security engine.
          </p>

        </div>


        <div className="scanner-grid">

          <div className="scanner-card">
            <div className="scanner-card-icon">✉</div>
            <small>01 · EMAIL SECURITY</small>
            <h3>Email Scanner</h3>
            <p>
              Analyze suspicious emails for phishing,
              fake senders and malicious links.
            </p>

            <Link to="/email-shield">
              Scan Email →
            </Link>
          </div>


          <div className="scanner-card">
            <div className="scanner-card-icon">▢</div>
            <small>02 · MESSAGE SECURITY</small>
            <h3>Message Scanner</h3>
            <p>
              Analyze SMS and suspicious messages
              for scam and fraud patterns.
            </p>

            <Link to="/message-detector">
              Scan Message →
            </Link>
          </div>


          <div className="scanner-card">
            <div className="scanner-card-icon">↗</div>
            <small>03 · WEB SECURITY</small>
            <h3>URL Scanner</h3>
            <p>
              Check websites and links for phishing
              and malicious domains.
            </p>

            <Link to="/url-scanner">
              Scan URL →
            </Link>
          </div>


          <div className="scanner-card">
            <div className="scanner-card-icon">▦</div>
            <small>04 · QR SECURITY</small>
            <h3>QR Scanner</h3>
            <p>
              Decode QR codes and detect malicious
              links and payment risks.
            </p>

            <Link to="/qr-scanner">
              Scan QR →
            </Link>
          </div>

        </div>

      </section>


      {/* FINAL CTA */}

      <section className="landing-final-cta">

        <div className="hero-eyebrow">
          <span className="live-dot" />
          DIGITAL TRUST STARTS HERE
        </div>

        <h2>
          Don't Guess.
          <br />
          <span>Verify.</span>
        </h2>

        <p>
          Scan suspicious emails, messages, URLs and QR codes
          with TrustShield AI.
        </p>

        <Link
          to="/dashboard"
          className="hero-primary-btn"
        >
          Open Dashboard →
        </Link>

      </section>

    </main>
  );
}