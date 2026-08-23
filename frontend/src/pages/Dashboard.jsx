import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { StatCard } from "../components/RiskUI.jsx";
import { Link } from "react-router-dom";

const RISK_COLORS = { TRUSTED: "#34d399", CAUTION: "#fbbf24", SUSPICIOUS: "#fb923c", DANGEROUS: "#f87171" };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboardStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="main-area"><PageHeader title="Dashboard" /><p style={{ color: "var(--danger)" }}>{error}</p></div>;
  if (!stats) return <div className="main-area"><PageHeader title="Dashboard" /><p className="text-lo">Loading…</p></div>;

  const pieData = Object.entries(stats.risk_breakdown).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Security Dashboard"
        description="Your Digital Trust Layer at a glance — scans, threats, and average trust score across every channel."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
        <StatCard label="Total Scans" value={stats.total_scans.toLocaleString()} />
        <StatCard label="Threats Detected" value={stats.threats_detected.toLocaleString()} accent="var(--danger)" />
        <StatCard label="Safe Messages" value={stats.safe_messages.toLocaleString()} accent="var(--safe)" />
        <StatCard label="Average Trust Score" value={`${stats.average_trust_score}/100`} accent="var(--verify)" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>
        <div className="panel panel-pad">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Scans — last 7 days</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.trend}>
              <XAxis dataKey="date" stroke="#5b6a87" fontSize={12} tickLine={false} axisLine={{ stroke: "#1e2a42" }} />
              <YAxis stroke="#5b6a87" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0e1524", border: "1px solid #1e2a42", borderRadius: 10, fontSize: 12 }} />
              <Line type="monotone" dataKey="scans" stroke="#7c7cff" strokeWidth={2.5} dot={{ r: 3 }} name="Scans" />
              <Line type="monotone" dataKey="threats" stroke="#f87171" strokeWidth={2.5} dot={{ r: 3 }} name="Threats" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel panel-pad">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Risk breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={RISK_COLORS[entry.name] || "#93a2bd"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0e1524", border: "1px solid #1e2a42", borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-16" style={{ flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            {pieData.map((e) => (
              <div key={e.name} className="flex items-center gap-8" style={{ fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: RISK_COLORS[e.name] }} />
                <span className="text-lo">{e.name} ({e.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel panel-pad">
        <div className="flex justify-between items-center" style={{ marginBottom: 18 }}>
          <div className="eyebrow">Quick actions</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <QuickLink to="/message-detector" label="Scan a Message" />
          <QuickLink to="/url-scanner" label="Scan a URL" />
          <QuickLink to="/qr-scanner" label="Scan a QR Code" />
          <QuickLink to="/live-simulator" label="Run Live Demo" />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link to={to} className="btn btn-ghost btn-block" style={{ justifyContent: "flex-start" }}>
      {label} →
    </Link>
  );
}
