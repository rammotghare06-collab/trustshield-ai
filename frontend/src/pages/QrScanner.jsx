import { useState, useRef } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import ScanResultPanel from "../components/ScanResultPanel.jsx";
import { ErrorBanner, LoadingScan } from "../components/RiskUI.jsx";

export default function QrScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  function handleFile(f) {
    if (!f) return;

    setError("");
    setResult(null);

    // Only allow image files
    if (!f.type.startsWith("image/")) {
      setFile(null);
      setPreview(null);
      setError("Please upload a valid QR code image.");
      return;
    }

    const imageUrl = URL.createObjectURL(f);

    setFile(f);
    setPreview(imageUrl);
  }

  async function handleScan() {
    if (!file) {
      setError("Please upload a QR code image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.scanQr(file);
      setResult(res);
    } catch (e) {
      setError(
        e?.message ||
          "Unable to scan this image. Please upload a clear QR code image."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Safe QR"
        title="QR Code Security Scanner"
        description="Upload a QR code image — TrustShield AI decodes the destination and checks it before you visit or pay."
      />

      <div className="panel panel-pad">
        {/* QR Upload Area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          style={{
            border: "1px dashed var(--hairline-bright)",
            borderRadius: 18,
            padding: 42,
            textAlign: "center",
            cursor: "pointer",
            background: "var(--void)",
            minHeight: 250,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.2s ease, background 0.2s ease",
          }}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="QR preview"
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "contain",
                  borderRadius: 12,
                }}
              />

              <div
                className="text-lo"
                style={{
                  marginTop: 14,
                  fontSize: 13,
                }}
              >
                QR image selected
              </div>

              <div
                className="text-lo"
                style={{
                  marginTop: 5,
                  fontSize: 12,
                }}
              >
                Click to choose another image
              </div>
            </>
          ) : (
            <>
              {/* QR Icon */}
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  border: "1px solid var(--hairline-bright)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  marginBottom: 16,
                }}
              >
                QR
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Upload a QR code
              </div>

              <div
                className="text-lo"
                style={{
                  fontSize: 13,
                }}
              >
                Click to upload or drag & drop
              </div>

              <div
                className="text-lo"
                style={{
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                PNG or JPG image
              </div>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            style={{ display: "none" }}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);

              // Allow selecting the same file again
              e.target.value = "";
            }}
          />
        </div>

        {/* Scan Button */}
        <div
          className="flex gap-12"
          style={{
            marginTop: 18,
          }}
        >
          <button
            className="btn btn-primary"
            onClick={handleScan}
            disabled={loading || !file}
          >
            {loading ? "Decoding…" : "Scan QR Code"}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <LoadingScan
            label="Decoding QR · Extracting destination · Checking link…"
          />
        )}

        {/* Error */}
        <ErrorBanner message={error} />
      </div>

      {/* Scan Result */}
      <ScanResultPanel result={result} />
    </div>
  );
}