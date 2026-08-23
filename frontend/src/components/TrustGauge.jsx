import { useEffect, useState } from "react";

const COLOR_MAP = {
  green: "var(--safe)",
  yellow: "var(--caution)",
  orange: "var(--suspicious)",
  red: "var(--danger)",
};

/**
 * Circular "radar scan" trust score gauge — the product's signature visual.
 * A sweeping arc animates in on mount, like a security scan settling on a
 * verdict, then the numeric score counts up.
 */
export default function TrustGauge({ score = 0, color = "green", size = 176, label = "TRUST SCORE" }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringColor = COLOR_MAP[color] || COLOR_MAP.green;

  useEffect(() => {
    setDisplayScore(0);
    setProgress(0);
    const duration = 900;
    const start = performance.now();
    let raf;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * score);
      setDisplayScore(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const dash = (progress / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--hairline)" strokeWidth="10" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 8px ${ringColor})`, transition: "stroke 0.3s ease" }}
        />
      </svg>

      {/* radar sweep line */}
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          overflow: "hidden",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `conic-gradient(from 0deg, transparent 0deg, ${ringColor}55 18deg, transparent 40deg)`,
            animation: "spin 3.2s linear infinite",
          }}
        />
      </div>

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: size * 0.24, fontWeight: 700, lineHeight: 1, color: "var(--text-hi)" }}>
          {displayScore}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>/ 100</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--text-lo)", marginTop: 6 }}>
          {label}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      `}</style>
    </div>
  );
}
