import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { StatCard } from "../components/RiskUI.jsx";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.dashboardStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return <div><PageHeader title="Analytics" /><p className="text-lo">Loading…</p></div>;

  const typeData = Object.entries(stats.by_type).map(([name, value]) => ({ name: labelType(name), value }));

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Threat Analytics"
        description="Deeper breakdown of scan volume, threat types and channel distribution."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
        <StatCard label="Total Scans" value={stats.total_scans} />
        <StatCard label="Threats Detected" value={stats.threats_detected} accent="var(--danger)" />
        <StatCard label="Caution Flags" value={stats.caution_count} accent="var(--caution)" />
      </div>

      <div className="panel panel-pad" style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Scans by channel</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={typeData}>
            <CartesianGrid stroke="#1e2a42" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#5b6a87" fontSize={12} tickLine={false} axisLine={{ stroke: "#1e2a42" }} />
            <YAxis stroke="#5b6a87" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0e1524", border: "1px solid #1e2a42", borderRadius: 10, fontSize: 12 }} cursor={{ fill: "rgba(124,124,255,0.06)" }} />
            <Bar dataKey="value" fill="#33d6c0" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel panel-pad">
        <div className="eyebrow" style={{ marginBottom: 16 }}>7-day scan & threat trend</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats.trend}>
            <CartesianGrid stroke="#1e2a42" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke="#5b6a87" fontSize={12} tickLine={false} axisLine={{ stroke: "#1e2a42" }} />
            <YAxis stroke="#5b6a87" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0e1524", border: "1px solid #1e2a42", borderRadius: 10, fontSize: 12 }} cursor={{ fill: "rgba(124,124,255,0.06)" }} />
            <Bar dataKey="scans" fill="#7c7cff" radius={[6, 6, 0, 0]} name="Scans" />
            <Bar dataKey="threats" fill="#f87171" radius={[6, 6, 0, 0]} name="Threats" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function labelType(t) {
  return { sms: "SMS", url: "URL", qr: "QR", email: "Email" }[t] || t;
}
