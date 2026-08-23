import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MessageDetector from "./pages/MessageDetector.jsx";
import UrlScanner from "./pages/UrlScanner.jsx";
import QrScanner from "./pages/QrScanner.jsx";
import EmailShield from "./pages/EmailShield.jsx";
import TrustPassport from "./pages/TrustPassport.jsx";
import CyberCopilot from "./pages/CyberCopilot.jsx";
import Analytics from "./pages/Analytics.jsx";
import ScanHistory from "./pages/ScanHistory.jsx";
import LiveSimulator from "./pages/LiveSimulator.jsx";
import Settings from "./pages/Settings.jsx";

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
      <Route path="/message-detector" element={<AppShell><MessageDetector /></AppShell>} />
      <Route path="/url-scanner" element={<AppShell><UrlScanner /></AppShell>} />
      <Route path="/qr-scanner" element={<AppShell><QrScanner /></AppShell>} />
      <Route path="/email-shield" element={<AppShell><EmailShield /></AppShell>} />
      <Route path="/trust-passport" element={<AppShell><TrustPassport /></AppShell>} />
      <Route path="/cyber-copilot" element={<AppShell><CyberCopilot /></AppShell>} />
      <Route path="/analytics" element={<AppShell><Analytics /></AppShell>} />
      <Route path="/scan-history" element={<AppShell><ScanHistory /></AppShell>} />
      <Route path="/live-simulator" element={<AppShell><LiveSimulator /></AppShell>} />
      <Route path="/settings" element={<AppShell><Settings /></AppShell>} />
    </Routes>
  );
}
