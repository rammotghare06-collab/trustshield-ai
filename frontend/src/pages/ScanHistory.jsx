import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { RiskBadge } from "../components/RiskUI.jsx";

const COLOR_MAP = {
  TRUSTED: "green",
  CAUTION: "yellow",
  SUSPICIOUS: "orange",
  DANGEROUS: "red",
};

const TYPE_ICON = {
  sms: "💬",
  message: "💬",
  url: "🔗",
  qr: "▣",
  email: "✉️",
};

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString();
}

function getTypeLabel(type) {
  if (!type) return "SCAN";

  const value = type.toLowerCase();

  if (value === "sms") return "SMS";
  if (value === "message") return "MESSAGE";
  if (value === "url") return "URL";
  if (value === "qr") return "QR";
  if (value === "email") return "EMAIL";

  return value.toUpperCase();
}

export default function ScanHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  async function load(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await api.history(100);

      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Failed to load scan history:", error);
      setRecords([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleClear() {
    if (
      !window.confirm(
        "Clear all scan history? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.clearHistory();

      setRecords([]);
      setSelectedRecord(null);
    } catch (error) {
      console.error("Failed to clear history:", error);
      alert("Failed to clear history.");
    }
  }

  function openDetails(record) {
    setSelectedRecord(record);
  }

  function closeDetails() {
    setSelectedRecord(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Scan History"
        title="Threat History"
        description="Every message, URL, QR code and email scanned by TrustShield AI, with trust score and risk outcome."
      />

      {/* Top Actions */}
      <div
        className="flex justify-between items-center"
        style={{
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          className="text-lo mono"
          style={{
            fontSize: 12.5,
          }}
        >
          {records.length} record(s)
        </span>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={() => load(true)}
            disabled={refreshing}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              opacity: refreshing ? 0.6 : 1,
            }}
          >
            {refreshing ? "Refreshing…" : "↻ Refresh"}
          </button>

          <button
            className="btn btn-ghost"
            onClick={handleClear}
            disabled={records.length === 0}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              opacity: records.length === 0 ? 0.5 : 1,
            }}
          >
            Clear history
          </button>
        </div>
      </div>

      {/* History Table */}
      <div
        className="panel"
        style={{
          overflow: "hidden",
        }}
      >
        {loading ? (
          <p
            className="text-lo"
            style={{
              padding: 24,
            }}
          >
            Loading…
          </p>
        ) : records.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 32,
                marginBottom: 10,
              }}
            >
              🛡️
            </div>

            <p
              className="text-lo"
              style={{
                margin: 0,
              }}
            >
              No scans yet. Run a scan to see it appear here.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13.5,
                minWidth: 1050,
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom:
                      "1px solid var(--hairline)",
                  }}
                >
                  {[
                    "Date",
                    "Type",
                    "Input",
                    "Score",
                    "Risk",
                    "Result",
                    "Details",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="text-lo"
                      style={{
                        padding: "14px 20px",
                        fontWeight: 600,
                        fontSize: 11.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {records.map((record) => {
                  const score =
                    typeof record.score === "number"
                      ? Math.round(record.score)
                      : "—";

                  const type =
                    record.scan_type?.toLowerCase();

                  const icon =
                    TYPE_ICON[type] || "🔍";

                  const riskColor =
                    COLOR_MAP[record.risk_level] ||
                    "green";

                  return (
                    <tr
                      key={record.id}
                      style={{
                        borderBottom:
                          "1px solid var(--hairline)",
                      }}
                    >
                      {/* Date */}
                      <td
                        className="mono"
                        style={{
                          padding: "14px 20px",
                          color: "var(--text-faint)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(
                          record.created_at
                        )}
                      </td>

                      {/* Type */}
                      <td
                        style={{
                          padding: "14px 20px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                            fontWeight: 600,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 16,
                            }}
                          >
                            {icon}
                          </span>

                          <span className="mono">
                            {getTypeLabel(
                              record.scan_type
                            )}
                          </span>
                        </span>
                      </td>

                      {/* Input */}
                      <td
                        style={{
                          padding: "14px 20px",
                          maxWidth: 360,
                        }}
                      >
                        <div
                          title={
                            record.input_summary ||
                            "No input"
                          }
                          style={{
                            maxWidth: 360,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {record.input_summary ||
                            "—"}
                        </div>
                      </td>

                      {/* Score */}
                      <td
                        className="mono"
                        style={{
                          padding: "14px 20px",
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                        }}
                      >
                        {score !== "—"
                          ? `${score}/100`
                          : "—"}
                      </td>

                      {/* Risk */}
                      <td
                        style={{
                          padding: "14px 20px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <RiskBadge
                          level={
                            record.risk_level
                          }
                          color={riskColor}
                        />
                      </td>

                      {/* Classification */}
                      <td
                        style={{
                          padding: "14px 20px",
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                        }}
                      >
                        {record.classification ||
                          "—"}
                      </td>

                      {/* Details */}
                      <td
                        style={{
                          padding: "14px 20px",
                        }}
                      >
                        <button
                          className="btn btn-ghost"
                          onClick={() =>
                            openDetails(record)
                          }
                          style={{
                            padding:
                              "7px 13px",
                            fontSize: 12,
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div
          onClick={closeDetails}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="panel"
            style={{
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 24,
              borderRadius: 12,
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-start",
                gap: 16,
                marginBottom: 22,
              }}
            >
              <div>
                <div
                  className="text-lo mono"
                  style={{
                    fontSize: 11,
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.08em",
                    marginBottom: 6,
                  }}
                >
                  Scan Details
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                  }}
                >
                  {TYPE_ICON[
                    selectedRecord.scan_type?.toLowerCase()
                  ] || "🔍"}{" "}
                  {getTypeLabel(
                    selectedRecord.scan_type
                  )}
                </h2>
              </div>

              <button
                className="btn btn-ghost"
                onClick={closeDetails}
                style={{
                  padding: "6px 11px",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Score + Risk */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  padding: 16,
                  border:
                    "1px solid var(--hairline)",
                  borderRadius: 10,
                }}
              >
                <div
                  className="text-lo"
                  style={{
                    fontSize: 11,
                    marginBottom: 6,
                    textTransform:
                      "uppercase",
                  }}
                >
                  Trust Score
                </div>

                <div
                  className="mono"
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {typeof selectedRecord.score ===
                  "number"
                    ? Math.round(
                        selectedRecord.score
                      )
                    : "—"}
                  <span
                    style={{
                      fontSize: 13,
                      opacity: 0.55,
                    }}
                  >
                    /100
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: 16,
                  border:
                    "1px solid var(--hairline)",
                  borderRadius: 10,
                }}
              >
                <div
                  className="text-lo"
                  style={{
                    fontSize: 11,
                    marginBottom: 8,
                    textTransform:
                      "uppercase",
                  }}
                >
                  Risk Level
                </div>

                <RiskBadge
                  level={
                    selectedRecord.risk_level
                  }
                  color={
                    COLOR_MAP[
                      selectedRecord.risk_level
                    ] || "green"
                  }
                />
              </div>
            </div>

            {/* Classification */}
            <div
              style={{
                padding: 16,
                border:
                  "1px solid var(--hairline)",
                borderRadius: 10,
                marginBottom: 18,
              }}
            >
              <div
                className="text-lo"
                style={{
                  fontSize: 11,
                  marginBottom: 7,
                  textTransform:
                    "uppercase",
                }}
              >
                Classification
              </div>

              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {selectedRecord.classification ||
                  "—"}
              </div>
            </div>

            {/* Scanned Input */}
            <div
              style={{
                marginBottom: 18,
              }}
            >
              <div
                className="text-lo"
                style={{
                  fontSize: 11,
                  marginBottom: 8,
                  textTransform:
                    "uppercase",
                }}
              >
                Scanned Input
              </div>

              <div
                style={{
                  padding: 15,
                  border:
                    "1px solid var(--hairline)",
                  borderRadius: 10,
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                  whiteSpace:
                    "pre-wrap",
                  background:
                    "rgba(127,127,127,0.04)",
                }}
              >
                {selectedRecord.full_input ||
  selectedRecord.input_summary ||
  "No input available."}
              </div>
            </div>

            {/* Metadata */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  padding: 14,
                  border:
                    "1px solid var(--hairline)",
                  borderRadius: 10,
                }}
              >
                <div
                  className="text-lo"
                  style={{
                    fontSize: 11,
                    marginBottom: 5,
                  }}
                >
                  Confidence
                </div>

                <div className="mono">
                  {typeof selectedRecord.confidence ===
                  "number"
                    ? `${Math.round(
                        selectedRecord.confidence
                      )}%`
                    : "—"}
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  border:
                    "1px solid var(--hairline)",
                  borderRadius: 10,
                }}
              >
                <div
                  className="text-lo"
                  style={{
                    fontSize: 11,
                    marginBottom: 5,
                  }}
                >
                  Indicators
                </div>

                <div className="mono">
                  {typeof selectedRecord.indicator_count ===
                  "number"
                    ? selectedRecord.indicator_count
                    : "—"}
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  border:
                    "1px solid var(--hairline)",
                  borderRadius: 10,
                  gridColumn:
                    "1 / -1",
                }}
              >
                <div
                  className="text-lo"
                  style={{
                    fontSize: 11,
                    marginBottom: 5,
                  }}
                >
                  Scanned At
                </div>

                <div className="mono">
                  {formatDate(
                    selectedRecord.created_at
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={closeDetails}
                style={{
                  padding:
                    "9px 18px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}