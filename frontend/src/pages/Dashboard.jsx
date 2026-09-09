import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { Link } from "react-router-dom";

const RISK_COLORS = {
  TRUSTED: "#34d399",
  CAUTION: "#fbbf24",
  SUSPICIOUS: "#fb923c",
  DANGEROUS: "#f87171",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    api.dashboardStats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="main-area">
        <PageHeader title="Dashboard" />
        <div className="dashboard-error">
          <span>⚠</span>
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="main-area">
        <PageHeader
          eyebrow="TrustShield AI"
          title="Security Command Center"
          description="Initializing your digital security intelligence layer..."
        />
        <div className="dashboard-loading">
          <div className="loading-orbit">
            <div />
          </div>
          <span>INITIALIZING SECURITY CORE...</span>
        </div>
      </div>
    );
  }

  const pieData = Object.entries(stats.risk_breakdown || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const trustScore = Number(stats.average_trust_score || 0);

  const threatPercent =
    stats.total_scans > 0
      ? Math.round((stats.threats_detected / stats.total_scans) * 100)
      : 0;

  const safePercent =
    stats.total_scans > 0
      ? Math.round((stats.safe_messages / stats.total_scans) * 100)
      : 0;

  const securityState =
    trustScore >= 80
      ? "SECURE"
      : trustScore >= 50
      ? "MONITORING"
      : "CRITICAL";

  return (
    <div className="command-dashboard">

      {/* =========================================================
          AMBIENT BACKGROUND
      ========================================================= */}

      <div className="ambient-grid" />
      <div className="ambient-glow glow-one" />
      <div className="ambient-glow glow-two" />

      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            style={{
              "--delay": `${i * 0.45}s`,
              "--x": `${(i * 37) % 100}%`,
              "--y": `${(i * 61) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <PageHeader
        eyebrow="Live Security Overview"
        title="Security Command Center"
        description="Your Digital Trust Layer — monitor scans, threats and trust intelligence from one unified security surface."
      />

      {/* =========================================================
          SYSTEM STATUS
      ========================================================= */}

      <div className="system-status-bar">
        <div className="system-status-left">
          <span className="live-dot" />
          <span className="mono-text">TRUSTSHIELD SECURITY CORE</span>
          <span className="status-divider" />
          <span className="mono-muted">REAL-TIME MONITORING</span>
        </div>

        <div className={`system-state ${securityState.toLowerCase()}`}>
          <span className="state-pulse" />
          SYSTEM {securityState}
        </div>
      </div>

      {/* =========================================================
          3D SECURITY CORE
      ========================================================= */}

      <section className="security-core">

        <div className="core-top-label">
          <span className="core-indicator" />
          SECURITY INTELLIGENCE MATRIX
        </div>

        {/* scanning line */}
        <div className="scan-line" />

        {/* 3D grid floor */}
        <div className="core-grid-floor" />

        {/* Floating metric cards */}

        <MetricCard
          className="metric-left-top"
          label="TOTAL SCANS"
          value={stats.total_scans}
          sub="ALL CHANNELS"
          icon="◇"
          type="safe"
          hovered={hovered}
          setHovered={setHovered}
        />

        <MetricCard
          className="metric-left-bottom"
          label="SAFE SCANS"
          value={stats.safe_messages}
          sub={`${safePercent}% CLEAN`}
          icon="✓"
          type="safe"
          hovered={hovered}
          setHovered={setHovered}
        />

        <MetricCard
          className="metric-right-top"
          label="THREATS"
          value={stats.threats_detected}
          sub={`${threatPercent}% DETECTED`}
          icon="⚠"
          type="danger"
          hovered={hovered}
          setHovered={setHovered}
        />

        <MetricCard
          className="metric-right-bottom"
          label="AVG TRUST"
          value={`${trustScore}%`}
          sub="GLOBAL SCORE"
          icon="◉"
          type="trust"
          hovered={hovered}
          setHovered={setHovered}
        />

        {/* =====================================================
            CENTRAL SHIELD
        ===================================================== */}

        <div className="core-center">

          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <div className="radar-sweep" />

          <div className="shield-core">
            <div className="shield-glow" />

            <div className="shield-shape">
              <div className="shield-inner">
                <span>✓</span>
              </div>
            </div>
          </div>

          <div className="core-score-label">
            TRUST SCORE
          </div>

          <div className="core-score">
            {trustScore}
            <small>/100</small>
          </div>

          <div className={`core-state ${securityState.toLowerCase()}`}>
            <span />
            {securityState} SECURITY STATE
          </div>
        </div>

        {/* corner data */}

        <div className="core-corner corner-tl">
          <span>NODE</span>
          <strong>TS-AI-01</strong>
        </div>

        <div className="core-corner corner-tr">
          <span>ENGINE</span>
          <strong>ACTIVE</strong>
        </div>

        <div className="core-corner corner-bl">
          <span>CHANNELS</span>
          <strong>04 ONLINE</strong>
        </div>

        <div className="core-corner corner-br">
          <span>THREAT INDEX</span>
          <strong>{threatPercent}%</strong>
        </div>
      </section>

      {/* =========================================================
          ANALYTICS ROW
      ========================================================= */}

      <div className="analytics-grid">

        {/* Scan Activity */}

        <div className="intel-panel activity-panel">

          <div className="panel-heading">
            <div>
              <div className="panel-eyebrow">
                <span />
                THREAT INTELLIGENCE
              </div>

              <h3>Scan Activity</h3>
            </div>

            <div className="panel-chip">
              LAST 7 DAYS
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.trend || []}>

                <defs>
                  <linearGradient
                    id="scanGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#34d399"
                      stopOpacity={0.32}
                    />
                    <stop
                      offset="100%"
                      stopColor="#34d399"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="date"
                  stroke="#51617e"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#51617e"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#07101d",
                    border: "1px solid #1c3850",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 12,
                    boxShadow: "0 15px 40px rgba(0,0,0,.45)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#34d399"
                  strokeWidth={3}
                  fill="url(#scanGradient)"
                  name="Scans"
                />

                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Threats"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-safe" />
              SCANS
            </span>

            <span>
              <i className="legend-danger" />
              THREATS
            </span>

            <span className="chart-live">
              ● LIVE DATA
            </span>
          </div>
        </div>

        {/* Risk Matrix */}

        <div className="intel-panel risk-panel">

          <div className="panel-heading">
            <div>
              <div className="panel-eyebrow">
                <span />
                THREAT DISTRIBUTION
              </div>

              <h3>Risk Matrix</h3>
            </div>

            <div className="radar-icon">
              ◉
            </div>
          </div>

          <div className="risk-chart">

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={4}
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        RISK_COLORS[entry.name] || "#64748b"
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#07101d",
                    border: "1px solid #1c3850",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="risk-center">
              <strong>{stats.total_scans}</strong>
              <span>SCANS</span>
            </div>
          </div>

          <div className="risk-list">
            {pieData.map((entry) => (
              <div
                key={entry.name}
                className="risk-item"
              >
                <div className="risk-name">
                  <span
                    style={{
                      background:
                        RISK_COLORS[entry.name] ||
                        "#64748b",
                    }}
                  />
                  {entry.name}
                </div>

                <strong>{entry.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          SECURITY TELEMETRY
      ========================================================= */}

      <div className="telemetry-grid">

        <TelemetryCard
          label="THREAT DETECTION"
          value={`${threatPercent}%`}
          description="Threat probability index"
          icon="⚠"
          danger
        />

        <TelemetryCard
          label="SAFE CHANNELS"
          value={`${safePercent}%`}
          description="Clean scan ratio"
          icon="✓"
        />

        <TelemetryCard
          label="TRUST ENGINE"
          value="ONLINE"
          description="Local AI analysis engine"
          icon="◉"
        />

        <TelemetryCard
          label="DATABASE"
          value="SYNCED"
          description="Scan history connected"
          icon="⌁"
        />
      </div>

      {/* =========================================================
          QUICK ACTIONS
      ========================================================= */}

      <div className="quick-section">

        <div className="quick-header">
          <div>
            <div className="panel-eyebrow">
              <span />
              SECURITY OPERATIONS
            </div>

            <h3>Quick Actions</h3>
          </div>

          <span className="mono-muted">
            SELECT SECURITY CHANNEL
          </span>
        </div>

        <div className="quick-grid">

          <QuickAction
            to="/message-detector"
            icon="💬"
            title="Message Scan"
            description="Analyze SMS & messages"
          />

          <QuickAction
            to="/url-scanner"
            icon="◎"
            title="URL Scanner"
            description="Inspect suspicious links"
          />

          <QuickAction
            to="/qr-scanner"
            icon="▦"
            title="QR Security"
            description="Decode & analyze QR codes"
          />

          <QuickAction
            to="/live-simulator"
            icon="⚡"
            title="Live Simulator"
            description="Run threat scenarios"
          />
        </div>
      </div>

      {/* =========================================================
          INLINE STYLES
      ========================================================= */}

      <style>{`

        /* ===============================
           MAIN
        =============================== */

        .command-dashboard {
          position: relative;
          min-height: 100%;
          overflow: hidden;
        }

        .command-dashboard > * {
          position: relative;
          z-index: 2;
        }

        /* ===============================
           BACKGROUND
        =============================== */

        .ambient-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0 !important;
          opacity: .18;
          background-image:
            linear-gradient(rgba(52,211,153,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,.035) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 85%
          );
        }

        .ambient-glow {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(100px);
          opacity: .07;
          z-index: 0 !important;
        }

        .glow-one {
          background: #00e5ff;
          top: 10%;
          left: 25%;
        }

        .glow-two {
          background: #7c3aed;
          right: -100px;
          bottom: 5%;
        }

        /* ===============================
           PARTICLES
        =============================== */

        .particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0 !important;
        }

        .particles span {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #5eead4;
          left: var(--x);
          top: var(--y);
          opacity: .35;
          animation: particleFloat 5s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes particleFloat {
          0%,100% {
            transform: translateY(0);
            opacity: .15;
          }
          50% {
            transform: translateY(-30px);
            opacity: .65;
          }
        }

        /* ===============================
           SYSTEM BAR
        =============================== */

        .system-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 22px 0 14px;
          padding: 10px 15px;
          border: 1px solid rgba(52,211,153,.12);
          background: rgba(5,15,25,.58);
          backdrop-filter: blur(14px);
          border-radius: 12px;
        }

        .system-status-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .live-dot,
        .core-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 14px #34d399;
          animation: livePulse 1.8s infinite;
        }

        @keyframes livePulse {
          0%,100% {
            box-shadow: 0 0 5px #34d399;
          }
          50% {
            box-shadow: 0 0 18px #34d399;
          }
        }

        .mono-text,
        .mono-muted {
          font-family: monospace;
          letter-spacing: 1.3px;
          font-size: 10px;
        }

        .mono-text {
          color: #5eead4;
        }

        .mono-muted {
          color: #62728d;
        }

        .status-divider {
          width: 1px;
          height: 14px;
          background: #223047;
        }

        .system-state {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 11px;
          border-radius: 30px;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .system-state.secure {
          color: #34d399;
          border: 1px solid rgba(52,211,153,.22);
          background: rgba(52,211,153,.05);
        }

        .system-state.monitoring {
          color: #fbbf24;
          border: 1px solid rgba(251,191,36,.22);
          background: rgba(251,191,36,.05);
        }

        .system-state.critical {
          color: #f87171;
          border: 1px solid rgba(248,113,113,.22);
          background: rgba(248,113,113,.05);
        }

        .state-pulse {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 10px currentColor;
        }

        /* ===============================
           SECURITY CORE
        =============================== */

        .security-core {
          position: relative;
          height: 440px;
          margin-bottom: 24px;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(64,103,137,.28);
          background:
            radial-gradient(
              circle at 50% 48%,
              rgba(24,89,108,.24),
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(29,52,90,.25),
              transparent 60%
            ),
            #050d18;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.025),
            0 25px 70px rgba(0,0,0,.28);
        }

        .core-top-label {
          position: absolute;
          top: 18px;
          left: 22px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #55d7ca;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 1.4px;
          z-index: 5;
        }

        .core-top-label .core-indicator {
          width: 6px;
          height: 6px;
        }

        .scan-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(52,211,153,.5),
            transparent
          );
          animation: scanVertical 5s linear infinite;
          opacity: .5;
          z-index: 4;
        }

        @keyframes scanVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(440px); }
        }

        /* ===============================
           GRID FLOOR
        =============================== */

        .core-grid-floor {
          position: absolute;
          left: 5%;
          right: 5%;
          bottom: -130px;
          height: 300px;
          transform: perspective(450px) rotateX(58deg);
          transform-origin: bottom;
          background-image:
            linear-gradient(
              rgba(44,104,132,.22) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(44,104,132,.22) 1px,
              transparent 1px
            );
          background-size: 45px 35px;
          mask-image: linear-gradient(
            to top,
            black,
            transparent
          );
        }

        /* ===============================
           CENTER CORE
        =============================== */

        .core-center {
          position: absolute;
          left: 50%;
          top: 51%;
          transform: translate(-50%,-50%);
          width: 280px;
          height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(45,174,180,.17);
          border-radius: 50%;
          left: 50%;
          top: 42%;
          transform: translate(-50%,-50%);
        }

        .orbit-one {
          width: 170px;
          height: 90px;
          animation: orbitSpin 8s linear infinite;
        }

        .orbit-two {
          width: 230px;
          height: 120px;
          animation: orbitSpin 12s linear infinite reverse;
        }

        .orbit-three {
          width: 300px;
          height: 150px;
          animation: orbitSpin 18s linear infinite;
          border-color: rgba(45,174,180,.08);
        }

        @keyframes orbitSpin {
          from {
            transform: translate(-50%,-50%) rotate(0deg);
          }
          to {
            transform: translate(-50%,-50%) rotate(360deg);
          }
        }

        .radar-sweep {
          position: absolute;
          width: 155px;
          height: 155px;
          border-radius: 50%;
          left: 50%;
          top: 42%;
          transform: translate(-50%,-50%);
          background: conic-gradient(
            from 0deg,
            rgba(52,211,153,.28),
            transparent 45deg,
            transparent 360deg
          );
          mask-image: radial-gradient(
            transparent 62%,
            black 64%,
            black 66%,
            transparent 68%
          );
          animation: radarSpin 4s linear infinite;
        }

        @keyframes radarSpin {
          to {
            transform: translate(-50%,-50%) rotate(360deg);
          }
        }

        /* ===============================
           SHIELD
        =============================== */

        .shield-core {
          position: relative;
          width: 112px;
          height: 130px;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -5px;
        }

        .shield-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #14b8a6;
          filter: blur(35px);
          opacity: .22;
          animation: shieldGlow 2.5s ease-in-out infinite;
        }

        @keyframes shieldGlow {
          0%,100% { opacity: .12; transform: scale(.9); }
          50% { opacity: .32; transform: scale(1.15); }
        }

        .shield-shape {
          width: 92px;
          height: 108px;
          clip-path: polygon(
            50% 0%,
            92% 18%,
            92% 58%,
            78% 82%,
            50% 100%,
            22% 82%,
            8% 58%,
            8% 18%
          );
          background: linear-gradient(
            145deg,
            #27e3ca,
            #2775d9
          );
          padding: 4px;
          filter:
            drop-shadow(0 0 16px rgba(45,211,196,.3));
          animation: shieldFloat 3s ease-in-out infinite;
        }

        @keyframes shieldFloat {
          0%,100% {
            transform: translateY(0) rotateY(0deg);
          }
          50% {
            transform: translateY(-5px) rotateY(7deg);
          }
        }

        .shield-inner {
          width: 100%;
          height: 100%;
          clip-path: inherit;
          background:
            linear-gradient(
              145deg,
              #091b2b,
              #07111e
            );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shield-inner span {
          font-size: 38px;
          color: #58e6d1;
          text-shadow: 0 0 18px rgba(88,230,209,.7);
        }

        .core-score-label {
          margin-top: 4px;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 2px;
          color: #6b7b95;
        }

        .core-score {
          font-size: 35px;
          line-height: 1;
          margin-top: 5px;
          font-weight: 800;
          color: #67e8f9;
          text-shadow: 0 0 20px rgba(103,232,249,.28);
        }

        .core-score small {
          font-size: 13px;
          color: #667895;
          margin-left: 2px;
        }

        .core-state {
          margin-top: 9px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .core-state span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 8px currentColor;
        }

        .core-state.secure {
          color: #34d399;
        }

        .core-state.monitoring {
          color: #fbbf24;
        }

        .core-state.critical {
          color: #f87171;
        }

        /* ===============================
           METRIC CARDS
        =============================== */

        .metric-card {
          position: absolute;
          width: 154px;
          min-height: 88px;
          padding: 15px;
          border: 1px solid rgba(63,99,130,.28);
          background:
            linear-gradient(
              145deg,
              rgba(11,28,43,.92),
              rgba(5,14,25,.86)
            );
          backdrop-filter: blur(12px);
          border-radius: 14px;
          box-shadow:
            0 20px 35px rgba(0,0,0,.25),
            inset 0 1px rgba(255,255,255,.025);
          transition: .3s ease;
          z-index: 5;
        }

        .metric-card:hover,
        .metric-card.active {
          transform: translateY(-6px) scale(1.025);
          border-color: rgba(52,211,153,.35);
          box-shadow:
            0 25px 50px rgba(0,0,0,.35),
            0 0 25px rgba(52,211,153,.06);
        }

        .metric-left-top {
          left: 6%;
          top: 31%;
        }

        .metric-left-bottom {
          left: 6%;
          top: 65%;
        }

        .metric-right-top {
          right: 6%;
          top: 31%;
        }

        .metric-right-bottom {
          right: 6%;
          top: 65%;
        }

        .metric-icon {
          position: absolute;
          right: 13px;
          top: 12px;
          font-size: 12px;
        }

        .metric-card.safe .metric-icon {
          color: #34d399;
        }

        .metric-card.danger .metric-icon {
          color: #f87171;
        }

        .metric-card.trust .metric-icon {
          color: #818cf8;
        }

        .metric-label {
          color: #64809b;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 1.3px;
        }

        .metric-value {
          font-size: 27px;
          font-weight: 800;
          margin-top: 6px;
          color: #e5eefb;
        }

        .metric-sub {
          color: #516780;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 1px;
          margin-top: 5px;
        }

        .metric-bar {
          margin-top: 8px;
          width: 100%;
          height: 2px;
          background: #172536;
          overflow: hidden;
          border-radius: 5px;
        }

        .metric-bar span {
          display: block;
          height: 100%;
          width: 65%;
          background: #34d399;
          box-shadow: 0 0 7px rgba(52,211,153,.5);
        }

        .metric-card.danger .metric-bar span {
          background: #f87171;
        }

        .metric-card.trust .metric-bar span {
          background: #818cf8;
        }

        /* ===============================
           CORNERS
        =============================== */

        .core-corner {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-family: monospace;
          z-index: 4;
        }

        .core-corner span {
          color: #354a64;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .core-corner strong {
          color: #65809c;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .corner-tl {
          top: 66px;
          left: 25px;
        }

        .corner-tr {
          top: 66px;
          right: 25px;
          text-align: right;
        }

        .corner-bl {
          bottom: 18px;
          left: 25px;
        }

        .corner-br {
          bottom: 18px;
          right: 25px;
          text-align: right;
        }

        /* ===============================
           ANALYTICS
        =============================== */

        .analytics-grid {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .intel-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(55,81,111,.28);
          background:
            linear-gradient(
              145deg,
              rgba(14,27,44,.9),
              rgba(7,15,27,.92)
            );
          border-radius: 20px;
          padding: 20px;
          box-shadow:
            0 18px 50px rgba(0,0,0,.16),
            inset 0 1px rgba(255,255,255,.025);
        }

        .intel-panel::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 80px;
          height: 1px;
          background: #34d399;
          box-shadow: 0 0 14px #34d399;
        }

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .panel-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #4ddac9;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 1.5px;
        }

        .panel-eyebrow span {
          width: 5px;
          height: 5px;
          background: #34d399;
          border-radius: 50%;
          box-shadow: 0 0 9px #34d399;
        }

        .panel-heading h3,
        .quick-header h3 {
          margin: 7px 0 0;
          font-size: 18px;
          color: #e4edf9;
        }

        .panel-chip {
          padding: 5px 8px;
          border-radius: 6px;
          background: rgba(52,211,153,.06);
          color: #50cdbd;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .chart-wrapper {
          margin-top: 14px;
        }

        .chart-legend {
          display: flex;
          gap: 18px;
          align-items: center;
          font-family: monospace;
          font-size: 8px;
          color: #5e728c;
        }

        .chart-legend span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .chart-legend i {
          width: 7px;
          height: 7px;
          display: inline-block;
          border-radius: 50%;
        }

        .legend-safe {
          background: #34d399;
        }

        .legend-danger {
          background: #f87171;
        }

        .chart-live {
          margin-left: auto;
          color: #34d399;
        }

        /* ===============================
           RISK
        =============================== */

        .risk-chart {
          position: relative;
        }

        .risk-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }

        .risk-center strong {
          color: #e6f1ff;
          font-size: 25px;
        }

        .risk-center span {
          color: #536b86;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .risk-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .risk-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 9px;
          border-radius: 8px;
          background: rgba(255,255,255,.018);
          border: 1px solid rgba(255,255,255,.025);
        }

        .risk-name {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #667d97;
          font-family: monospace;
          font-size: 7px;
        }

        .risk-name span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .risk-item strong {
          color: #dce8f8;
          font-size: 11px;
        }

        /* ===============================
           TELEMETRY
        =============================== */

        .telemetry-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .telemetry-card {
          position: relative;
          padding: 17px;
          border-radius: 14px;
          border: 1px solid rgba(55,81,111,.25);
          background: rgba(9,19,32,.8);
          overflow: hidden;
          transition: .25s ease;
        }

        .telemetry-card:hover {
          transform: translateY(-3px);
          border-color: rgba(52,211,153,.25);
        }

        .telemetry-icon {
          position: absolute;
          right: 17px;
          top: 15px;
          font-size: 17px;
          color: #34d399;
        }

        .telemetry-card.danger .telemetry-icon {
          color: #f87171;
        }

        .telemetry-label {
          color: #516983;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 1.2px;
        }

        .telemetry-value {
          color: #e5effc;
          font-size: 21px;
          font-weight: 800;
          margin-top: 7px;
        }

        .telemetry-description {
          color: #455c76;
          font-size: 9px;
          margin-top: 3px;
        }

        /* ===============================
           QUICK ACTIONS
        =============================== */

        .quick-section {
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 20px;
          border: 1px solid rgba(55,81,111,.28);
          background:
            linear-gradient(
              145deg,
              rgba(12,25,41,.88),
              rgba(6,14,25,.9)
            );
        }

        .quick-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 12px;
        }

        .quick-action {
          position: relative;
          min-height: 105px;
          padding: 17px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          border-radius: 13px;
          border: 1px solid rgba(63,92,121,.28);
          background: rgba(6,16,28,.78);
          transition: .3s ease;
          overflow: hidden;
        }

        .quick-action::after {
          content: "→";
          position: absolute;
          right: 15px;
          bottom: 14px;
          color: #36516c;
          font-size: 16px;
          transition: .25s;
        }

        .quick-action:hover {
          transform: translateY(-5px);
          border-color: rgba(52,211,153,.38);
          background: rgba(12,32,43,.85);
          box-shadow:
            0 18px 35px rgba(0,0,0,.25),
            0 0 25px rgba(52,211,153,.05);
        }

        .quick-action:hover::after {
          color: #34d399;
          transform: translateX(4px);
        }

        .quick-icon {
          font-size: 20px;
          filter: drop-shadow(0 0 8px rgba(52,211,153,.2));
        }

        .quick-title {
          color: #dce8f7;
          font-size: 12px;
          font-weight: 700;
          margin-top: 9px;
        }

        .quick-description {
          color: #506680;
          font-size: 9px;
          margin-top: 3px;
        }

        /* ===============================
           LOADING / ERROR
        =============================== */

        .dashboard-loading {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #4ddac9;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
        }

        .loading-orbit {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 1px solid rgba(52,211,153,.15);
          border-top-color: #34d399;
          animation: loadingSpin 1s linear infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-orbit div {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(129,140,248,.25);
          border-bottom-color: #818cf8;
          animation: loadingSpin .7s linear infinite reverse;
        }

        @keyframes loadingSpin {
          to { transform: rotate(360deg); }
        }

        .dashboard-error {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(248,113,113,.25);
          background: rgba(248,113,113,.05);
          color: #f87171;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        /* ===============================
           MOBILE
        =============================== */

        @media (max-width: 1000px) {

          .security-core {
            height: 430px;
          }

          .metric-left-top,
          .metric-left-bottom {
            left: 3%;
          }

          .metric-right-top,
          .metric-right-bottom {
            right: 3%;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .telemetry-grid {
            grid-template-columns: repeat(2,1fr);
          }

          .quick-grid {
            grid-template-columns: repeat(2,1fr);
          }
        }

        @media (max-width: 700px) {

          .system-status-left .mono-muted,
          .status-divider {
            display: none;
          }

          .security-core {
            height: 520px;
          }

          .core-center {
            top: 50%;
          }

          .metric-card {
            width: 125px;
            min-height: 75px;
            padding: 11px;
          }

          .metric-value {
            font-size: 21px;
          }

          .metric-left-top {
            left: 10px;
            top: 12%;
          }

          .metric-left-bottom {
            left: 10px;
            bottom: 10%;
            top: auto;
          }

          .metric-right-top {
            right: 10px;
            top: 12%;
          }

          .metric-right-bottom {
            right: 10px;
            bottom: 10%;
            top: auto;
          }

          .core-corner {
            display: none;
          }

          .telemetry-grid {
            grid-template-columns: 1fr 1fr;
          }

          .quick-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

      `}</style>
    </div>
  );
}

/* =============================================================
   METRIC CARD
============================================================= */

function MetricCard({
  label,
  value,
  sub,
  icon,
  type,
  className,
  hovered,
  setHovered,
}) {
  return (
    <div
      className={`metric-card ${type} ${className} ${
        hovered === label ? "active" : ""
      }`}
      onMouseEnter={() => setHovered(label)}
      onMouseLeave={() => setHovered(null)}
    >
      <span className="metric-icon">{icon}</span>

      <div className="metric-label">
        {label}
      </div>

      <div className="metric-value">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </div>

      <div className="metric-sub">
        {sub}
      </div>

      <div className="metric-bar">
        <span />
      </div>
    </div>
  );
}

/* =============================================================
   TELEMETRY CARD
============================================================= */

function TelemetryCard({
  label,
  value,
  description,
  icon,
  danger = false,
}) {
  return (
    <div className={`telemetry-card ${danger ? "danger" : ""}`}>
      <div className="telemetry-icon">
        {icon}
      </div>

      <div className="telemetry-label">
        {label}
      </div>

      <div className="telemetry-value">
        {value}
      </div>

      <div className="telemetry-description">
        {description}
      </div>
    </div>
  );
}

/* =============================================================
   QUICK ACTION
============================================================= */

function QuickAction({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link to={to} className="quick-action">
      <div className="quick-icon">
        {icon}
      </div>

      <div>
        <div className="quick-title">
          {title}
        </div>

        <div className="quick-description">
          {description}
        </div>
      </div>
    </Link>
  );
}