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

      <main className="main-area">
        {children}
      </main>
    </div>
  );
}


export default function App() {
  return (
    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={<Landing />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <AppShell>
            <Dashboard />
          </AppShell>
        }
      />

      {/* Message Detector */}
      <Route
        path="/message-detector"
        element={
          <AppShell>
            <MessageDetector />
          </AppShell>
        }
      />

      {/* URL Scanner */}
      <Route
        path="/url-scanner"
        element={
          <AppShell>
            <UrlScanner />
          </AppShell>
        }
      />

      {/* QR Scanner */}
      <Route
        path="/qr-scanner"
        element={
          <AppShell>
            <QrScanner />
          </AppShell>
        }
      />

      {/* Email Shield */}
      <Route
        path="/email-shield"
        element={
          <AppShell>
            <EmailShield />
          </AppShell>
        }
      />

      {/* Trust Passport */}
      <Route
        path="/trust-passport"
        element={
          <AppShell>
            <TrustPassport />
          </AppShell>
        }
      />

      {/* Cyber Copilot */}
      <Route
        path="/cyber-copilot"
        element={
          <AppShell>
            <CyberCopilot />
          </AppShell>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={
          <AppShell>
            <Analytics />
          </AppShell>
        }
      />

      {/* Scan History */}
      <Route
        path="/scan-history"
        element={
          <AppShell>
            <ScanHistory />
          </AppShell>
        }
      />

      {/* Live Simulator */}
      <Route
        path="/live-simulator"
        element={
          <AppShell>
            <LiveSimulator />
          </AppShell>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <AppShell>
            <Settings />
          </AppShell>
        }
      />

    </Routes>
  );
}