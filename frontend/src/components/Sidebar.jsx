import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/message-detector", label: "Message Detector", icon: "search" },
  { to: "/url-scanner", label: "URL Scanner", icon: "globe" },
  { to: "/qr-scanner", label: "Safe QR", icon: "qr" },
  { to: "/email-shield", label: "Email Shield", icon: "mail" },
  { to: "/trust-passport", label: "Trust Passport", icon: "badge" },
  { to: "/cyber-copilot", label: "Cyber Copilot", icon: "bot" },
  { to: "/analytics", label: "Analytics", icon: "chart" },
  { to: "/scan-history", label: "Scan History", icon: "clock" },
  { to: "/live-simulator", label: "Live Simulator", icon: "bolt" },
  { to: "/settings", label: "Settings", icon: "gear" },
];

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "grid": return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>;
    case "globe": return <svg {...common}><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3c2.6 2.7 4 6 4 9s-1.4 6.3-4 9c-2.6-2.7-4-6-4-9s1.4-6.3 4-9z"/></svg>;
    case "qr": return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14" x2="14" y2="21"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="17.5" y1="14" x2="17.5" y2="17.5"/></svg>;
    case "mail": return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case "badge": return <svg {...common}><path d="M12 2l3 2h4v4l2 3-2 3v4h-4l-3 2-3-2H5v-4l-2-3 2-3V4h4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "bot": return <svg {...common}><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1.2"/><line x1="9" y1="14" x2="9" y2="15.5"/><line x1="15" y1="14" x2="15" y2="15.5"/></svg>;
    case "chart": return <svg {...common}><line x1="4" y1="20" x2="4" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="20" y1="20" x2="20" y2="14"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>;
    case "bolt": return <svg {...common}><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>;
    case "gear": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>;
    default: return null;
  }
}

export default function Sidebar() {
  return (
    <aside style={{
      borderRight: "1px solid var(--hairline)",
      background: "linear-gradient(180deg, #0b111e, #070b14)",
      padding: "24px 16px",
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 24px", borderBottom: "1px solid var(--hairline)", marginBottom: 18 }}>
        <ShieldMark />
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}>TrustShield</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--verify)" }}>AI</div>
        </div>
      </a>

      <nav className="flex-col gap-8">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? "var(--text-hi)" : "var(--text-lo)",
              background: isActive ? "linear-gradient(90deg, rgba(51,214,192,0.14), rgba(124,124,255,0.06))" : "transparent",
              borderLeft: isActive ? "2px solid var(--verify)" : "2px solid transparent",
            })}
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 28, padding: 14, borderRadius: 14, border: "1px solid var(--hairline)", background: "var(--panel)" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>TrustShield AI Analysis</div>
        <p style={{ fontSize: 12, color: "var(--text-lo)", lineHeight: 1.5 }}>
Results are generated using our local security analysis engine.
        </p>
      </div>
    </aside>
  );
}

export function ShieldMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3 L34 9 V19 C34 28 28 34.5 20 37 C12 34.5 6 28 6 19 V9 Z" fill="url(#sg)" stroke="var(--hairline-bright)" />
      <path d="M14 20.5l4 4 8-9" stroke="#050810" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs>
        <linearGradient id="sg" x1="6" y1="3" x2="34" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="#33D6C0" />
          <stop offset="1" stopColor="#7C7CFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
