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
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      display: "block",
    },
  };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      );

    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <path d="M12 3c2.6 2.7 4 6 4 9s-1.4 6.3-4 9c-2.6-2.7-4-6.3-4-9s1.4-6.3 4-9z" />
        </svg>
      );

    case "qr":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <line x1="14" y1="14" x2="14" y2="21" />
          <line x1="21" y1="14" x2="21" y2="21" />
          <line x1="17.5" y1="14" x2="17.5" y2="17.5" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );

    case "badge":
      return (
        <svg {...common}>
          <path d="M12 2l3 2h4v4l2 3-2 3v4h-4l-3 2-3-2H5v-4l-2-3 2-3V4h4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );

    case "bot":
      return (
        <svg {...common}>
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M12 8V4" />
          <circle cx="12" cy="3" r="1.2" />
          <line x1="9" y1="14" x2="9" y2="15.5" />
          <line x1="15" y1="14" x2="15" y2="15.5" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="4" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="20" y1="20" x2="20" y2="14" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );

    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
        </svg>
      );

    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   TRUSTSHIELD PREMIUM LOGO
   ========================================================= */

export function ShieldMark({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 72"
      fill="none"
      style={{
        display: "block",
        filter: "drop-shadow(0 0 7px rgba(51,214,192,.30))",
      }}
    >
      <path
        d="M32 4L56 13V34C56 50 47 62 32 68C17 62 8 50 8 34V13L32 4Z"
        fill="#0D1728"
        stroke="url(#trustshieldSidebarGradient)"
        strokeWidth="2.5"
      />

      <path
        d="M21 36L28 43L44 27"
        stroke="#33D6C0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 0 4px rgba(51,214,192,.45))"
      />

      <defs>
        <linearGradient
          id="trustshieldSidebarGradient"
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
  );
}

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        boxSizing: "border-box",

        display: "flex",
        flexDirection: "column",

        padding: "22px 14px",

        background:
          "linear-gradient(180deg, #0a1020 0%, #070b16 55%, #050811 100%)",

        borderRight: "1px solid rgba(90,120,180,0.18)",

        boxShadow:
          "12px 0 40px rgba(0,0,0,0.28), inset -1px 0 rgba(80,220,210,0.05)",

        overflowY: "auto",
        overflowX: "hidden",

        zIndex: 100,
      }}
    >
      {/* LOGO */}
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "11px",

          textDecoration: "none",
          color: "inherit",

          padding: "2px 9px 20px",
          marginBottom: "18px",

          borderBottom: "1px solid rgba(100,130,180,0.15)",

          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background:
              "linear-gradient(145deg, rgba(51,214,192,.18), rgba(124,124,255,.16))",

            border: "1px solid rgba(51,214,192,.28)",

            boxShadow:
              "0 0 25px rgba(51,214,192,.10), inset 0 0 18px rgba(124,124,255,.08)",

            flexShrink: 0,
          }}
        >
          <ShieldMark size={29} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 16,
              lineHeight: 1.1,
              color: "#edf4ff",
              whiteSpace: "nowrap",
            }}
          >
            TrustShield
          </div>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "#33d6c0",
              marginTop: 3,
            }}
          >
            AI SECURITY
          </div>
        </div>
      </a>

      {/* NAVIGATION */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          width: "100%",
          flex: 1,
        }}
      >
        {NAV_ITEMS.map((item) => (
  <NavLink
    key={item.to}
    to={item.to}
    className="sidebar-nav-link"
    style={({ isActive }) => ({
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "46px",

      boxSizing: "border-box",

      gap: "12px",
      padding: "0 12px",

      borderRadius: "12px",

      textDecoration: "none",

      fontSize: "13.5px",
      fontWeight: 600,

      color: isActive ? "#f2f7ff" : "#8fa0bb",

      background: isActive
        ? "linear-gradient(100deg, rgba(51,214,192,.16), rgba(124,124,255,.10))"
        : "transparent",

      border: isActive
        ? "1px solid rgba(51,214,192,.18)"
        : "1px solid transparent",

      boxShadow: isActive
        ? "0 8px 25px rgba(0,0,0,.18), inset 0 0 18px rgba(51,214,192,.035)"
        : "none",

      position: "relative",

      /* IMPORTANT */
      transform: "translateX(0)",

      transition:
        "transform .22s ease, background .22s ease, border-color .22s ease, box-shadow .22s ease",

      flexShrink: 0,

      whiteSpace: "nowrap",
    })}
  >
          
        
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "8px",
                      bottom: "8px",
                      width: "3px",
                      borderRadius: "0 4px 4px 0",
                      background:
                        "linear-gradient(180deg, #33d6c0, #7c7cff)",
                      boxShadow: "0 0 12px rgba(51,214,192,.7)",
                    }}
                  />
                )}

                <span
                  style={{
                    width: 31,
                    height: 31,
                    borderRadius: 9,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    background: isActive
                      ? "rgba(51,214,192,.10)"
                      : "rgba(120,140,180,.045)",

                    color: isActive ? "#33d6c0" : "#7f91ad",

                    border: isActive
                      ? "1px solid rgba(51,214,192,.16)"
                      : "1px solid rgba(120,140,180,.06)",

transition: "transform .22s ease, background .22s ease, border-color .22s ease, box-shadow .22s ease",                  }}
                >
                  <Icon name={item.icon} />
                </span>

                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#33d6c0",
                      boxShadow: "0 0 10px rgba(51,214,192,.9)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* STATUS CARD */}
      <div
        style={{
          marginTop: "18px",
          padding: "15px",

          borderRadius: "15px",

          background:
            "linear-gradient(145deg, rgba(16,28,48,.95), rgba(9,15,28,.95))",

          border: "1px solid rgba(90,130,190,.16)",

          boxShadow:
            "0 15px 35px rgba(0,0,0,.22), inset 0 1px rgba(255,255,255,.025)",

          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 9,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#33d6c0",
              boxShadow: "0 0 10px #33d6c0",
            }}
          />

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "#33d6c0",
            }}
          >
            TRUSTSHIELD CORE
          </span>
        </div>

        <div
          style={{
            fontSize: 12,
            lineHeight: 1.55,
            color: "#8293ae",
          }}
        >
          Local security analysis engine active.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 11,

            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "#5e718f",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#34d399",
            }}
          />

          SYSTEM ONLINE
        </div>
      </div>
    </aside>
  );
}