import TrustGauge from "./TrustGauge.jsx";
import { RiskBadge, IndicatorList } from "./RiskUI.jsx";
import TrustPassportCard from "./TrustPassportCard.jsx";

export default function ScanResultPanel({
  result,
  simulated = false,
}) {
  if (!result) return null;

  const scanType = String(
    result.scan_type ||
      result.scanType ||
      result.type ||
      ""
  ).toLowerCase();

  const findings =
    result.findings ||
    result.analysis ||
    {};

  const isQrResult =
    scanType.includes("qr") ||
    Boolean(
      findings.decoded_data ||
        findings.decoded_destination ||
        findings.destination ||
        findings.decoded ||
        result.decoded_data ||
        result.decoded_destination ||
        result.destination ||
        result.decoded
    );

  if (isQrResult) {
    return (
      <QrResultPanel
        result={result}
        simulated={simulated}
      />
    );
  }

  return (
    <DefaultResultPanel
      result={result}
      simulated={simulated}
    />
  );
}


/* =========================================================
   DEFAULT RESULT PANEL
========================================================= */

function DefaultResultPanel({
  result,
  simulated,
}) {
  const recommendation =
    result.recommendation || {
      summary: "No recommendation available.",
      steps: [],
    };

  const recommendationSummary =
    typeof recommendation === "string"
      ? recommendation
      : recommendation.summary ||
        recommendation.message ||
        recommendation.text ||
        "No recommendation available.";

  const recommendationSteps =
    typeof recommendation === "object" &&
    recommendation !== null
      ? recommendation.steps ||
        recommendation.actions ||
        recommendation.suggestions ||
        []
      : [];

  return (
    <div
      className="fade-in flex-col gap-24"
      style={{ marginTop: 28 }}
    >
      {simulated && (
        <div
          className="eyebrow"
          style={{ color: "var(--ai)" }}
        >
          Simulated / demo intelligence — not live threat data
        </div>
      )}

      <div
        className="panel panel-pad"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        <TrustGauge
          score={result.score}
          color={result.color}
        />

        <div className="flex-col gap-12">
          <RiskBadge
            level={result.risk_level}
            color={result.color}
          />

          <h2 style={{ fontSize: 26 }}>
            {result.classification}
          </h2>

          <div
            className="flex gap-24"
            style={{ flexWrap: "wrap" }}
          >
            <MiniStat
              label="Confidence"
              value={`${result.confidence ?? 0}%`}
            />

            <MiniStat
              label="Threat Indicators"
              value={`${result.indicator_count ?? 0} detected`}
            />

            {result.scenario_title && (
              <MiniStat
                label="Scenario"
                value={result.scenario_title}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "1.3fr 1fr",
          gap: 24,
        }}
      >
        <div className="panel panel-pad">
          <div
            className="eyebrow"
            style={{ marginBottom: 14 }}
          >
            Why?
          </div>

          <IndicatorList
            indicators={result.indicators || []}
          />
        </div>

        <div className="panel panel-pad">
          <div
            className="eyebrow"
            style={{ marginBottom: 12 }}
          >
            Recommendation
          </div>

          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.6,
              marginBottom:
                recommendationSteps.length > 0
                  ? 14
                  : 0,
            }}
          >
            {recommendationSummary}
          </p>

          {recommendationSteps.length > 0 && (
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {recommendationSteps.map(
                (step, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: 13.5,
                      color: "var(--text-lo)",
                      lineHeight: 1.5,
                    }}
                  >
                    {typeof step === "string"
                      ? step
                      : step?.text ||
                        step?.message ||
                        step?.label ||
                        String(step)}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>

      <TrustPassportCard
        passport={result.trust_passport}
        scanType={result.scan_type}
      />
    </div>
  );
}


/* =========================================================
   QR RESULT PANEL
========================================================= */

function QrResultPanel({
  result,
  simulated,
}) {
  const findings =
    result.findings ||
    result.analysis ||
    {};

  /* -------------------------------------------------------
     DECODED DATA
  ------------------------------------------------------- */

  const decodedData =
    findings.decoded_data ||
    findings.decoded_destination ||
    findings.destination ||
    findings.decoded ||
    result.decoded_data ||
    result.decoded_destination ||
    result.destination ||
    result.decoded ||
    "";

  /* -------------------------------------------------------
     PAYLOAD TYPE
  ------------------------------------------------------- */

  const payloadType =
    findings.payload_type ||
    findings.qr_type ||
    findings.type ||
    result.payload_type ||
    result.qr_type ||
    "";

  const qrType = getQrType(
    payloadType,
    decodedData
  );

  /* -------------------------------------------------------
     EFFECTIVE RISK
  ------------------------------------------------------- */

  const riskLevel = getEffectiveQrRisk(
    result,
    decodedData
  );

  /* -------------------------------------------------------
     TITLE
  ------------------------------------------------------- */

  const resultTitle = getQrResultTitle(
    payloadType,
    result.classification,
    decodedData
  );

  /* -------------------------------------------------------
     SECURITY INDICATORS
  ------------------------------------------------------- */

  const rawIndicators =
    result.indicators ||
    findings.indicators ||
    findings.security_indicators ||
    findings.analysis?.indicators ||
    [];

  const securityIndicators =
    shouldUseBackendIndicators(
      rawIndicators,
      decodedData
    )
      ? normalizeIndicators(
          rawIndicators,
          riskLevel
        )
      : buildQrIndicators(
          decodedData,
          riskLevel
        );

  /* -------------------------------------------------------
     RECOMMENDATION
  ------------------------------------------------------- */

  const rawRecommendation =
    result.recommendation ||
    findings.recommendation ||
    result.advice ||
    findings.advice ||
    null;

  /*
   * QR/UPI ke liye hum backend generic recommendation
   * ko blindly display nahi karenge.
   *
   * Isse UPI CAUTION ka recommendation predictable rahega.
   */

  const isUpi =
    String(decodedData)
      .trim()
      .toLowerCase()
      .startsWith("upi://");

  const recommendationSummary =
    isUpi
      ? getQrRecommendation(
          decodedData,
          riskLevel
        )
      : getRecommendation(
          rawRecommendation,
          decodedData,
          riskLevel
        );

  const recommendationSteps =
    !isUpi &&
    typeof rawRecommendation === "object" &&
    rawRecommendation !== null
      ? rawRecommendation.steps ||
        rawRecommendation.actions ||
        rawRecommendation.suggestions ||
        rawRecommendation.recommendations ||
        []
      : [];

  const indicatorCount =
    securityIndicators.length;

  /* -------------------------------------------------------
     DISPLAY SCORE
  ------------------------------------------------------- */

  const displayScore =
    getDisplayScore(
      result,
      riskLevel
    );

  /* -------------------------------------------------------
     DISPLAY COLOR
  ------------------------------------------------------- */

  const displayColor =
    getQrDisplayColor(
      riskLevel,
      result.color
    );

  return (
    <div
      className="fade-in flex-col gap-24"
      style={{ marginTop: 28 }}
    >

      {/* DEMO LABEL */}

      {simulated && (
        <div
          className="eyebrow"
          style={{ color: "var(--ai)" }}
        >
          Simulated / demo intelligence — not live threat data
        </div>
      )}


      {/* =================================================
          MAIN RESULT
      ================================================= */}

      <div
        className="panel panel-pad"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >

        <TrustGauge
          score={displayScore}
          color={displayColor}
        />

        <div className="flex-col gap-12">

          {/* RISK BADGE */}

          <RiskBadge
            level={riskLevel}
            color={displayColor}
          />

          <h2
            style={{
              fontSize: 26,
              margin: 0,
            }}
          >
            {resultTitle}
          </h2>

          <p
            className="text-lo"
            style={{
              fontSize: 14,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            TrustShield successfully decoded this QR code.
          </p>

          {/* STATS */}

          <div
            className="flex gap-24"
            style={{
              flexWrap: "wrap",
            }}
          >
            <MiniStat
              label="QR Type"
              value={qrType}
            />

            <MiniStat
              label="Risk"
              value={riskLevel}
            />

            <MiniStat
              label="Status"
              value="Decoded"
            />

            <MiniStat
              label="Confidence"
              value={`${result.confidence ?? 0}%`}
            />

            <MiniStat
              label="Indicators"
              value={`${indicatorCount} detected`}
            />
          </div>

        </div>
      </div>


      {/* =================================================
          DECODED DESTINATION
      ================================================= */}

      <div className="panel panel-pad">

        <div
          className="eyebrow"
          style={{ marginBottom: 14 }}
        >
          Decoded Destination
        </div>

        <div
          className="mono"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "18px 16px",
            borderRadius: 12,
            background: "var(--void)",
            border: "1px solid var(--hairline)",
            color: "var(--text-hi)",
            fontSize: 13,
            lineHeight: 1.6,
            wordBreak: "break-all",
          }}
        >
          {decodedData ||
            "QR content decoded successfully."}
        </div>

        <p
          className="text-faint"
          style={{
            fontSize: 12.5,
            marginTop: 12,
            marginBottom: 0,
            lineHeight: 1.5,
          }}
        >
          Do not open or interact with the decoded
          destination until the security analysis
          has been reviewed.
        </p>

      </div>


      {/* =================================================
          WHY + RECOMMENDATION
      ================================================= */}

      <div
        className="grid"
        style={{
          gridTemplateColumns: "1.3fr 1fr",
          gap: 24,
        }}
      >

        {/* WHY */}

        <div className="panel panel-pad">

          <div
            className="eyebrow"
            style={{ marginBottom: 14 }}
          >
            Why?
          </div>

          <SecurityAnalysisList
            indicators={securityIndicators}
          />

        </div>


        {/* RECOMMENDATION */}

        <div className="panel panel-pad">

          <div
            className="eyebrow"
            style={{ marginBottom: 12 }}
          >
            Recommendation
          </div>

          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.6,
              marginBottom:
                recommendationSteps.length > 0
                  ? 14
                  : 0,
            }}
          >
            {recommendationSummary}
          </p>

          {recommendationSteps.length > 0 && (
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {recommendationSteps.map(
                (step, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: 13.5,
                      color: "var(--text-lo)",
                      lineHeight: 1.5,
                    }}
                  >
                    {typeof step === "string"
                      ? step
                      : step?.text ||
                        step?.message ||
                        step?.label ||
                        String(step)}
                  </li>
                )
              )}
            </ul>
          )}

        </div>

      </div>


      {/* =================================================
          TRUST PASSPORT
      ================================================= */}

      <TrustPassportCard
        passport={result.trust_passport}
        scanType="qr"
      />

    </div>
  );
}


/* =========================================================
   SECURITY ANALYSIS LIST
========================================================= */

function SecurityAnalysisList({
  indicators,
}) {
  if (
    !indicators ||
    indicators.length === 0
  ) {
    return (
      <p
        className="text-faint"
        style={{ fontSize: 14 }}
      >
        No specific security indicators were detected.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {indicators.map(
        (indicator, index) => {

          const item =
            typeof indicator === "string"
              ? {
                  level: "INFO",
                  text: indicator,
                }
              : {
                  level:
                    indicator?.level ||
                    indicator?.severity ||
                    indicator?.risk ||
                    indicator?.type ||
                    indicator?.status ||
                    "INFO",

                  text:
                    indicator?.text ||
                    indicator?.label ||
                    indicator?.message ||
                    indicator?.description ||
                    indicator?.reason ||
                    indicator?.name ||
                    indicator?.indicator ||
                    indicator?.value ||
                    indicator?.title ||
                    "Security indicator detected.",
                };

          const level =
            String(item.level)
              .toUpperCase();

          const isHigh =
            level === "HIGH" ||
            level === "CRITICAL" ||
            level === "DANGEROUS";

          const isMedium =
            level === "MEDIUM" ||
            level === "CAUTION" ||
            level === "WARNING";

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "13px 0",
                borderBottom:
                  index !==
                  indicators.length - 1
                    ? "1px solid var(--hairline)"
                    : "none",
              }}
            >

              <span
                className="mono"
                style={{
                  fontSize: 10,
                  minWidth: 58,
                  textAlign: "center",
                  padding: "4px 7px",
                  borderRadius: 6,

                  background: isHigh
                    ? "rgba(239, 68, 68, 0.12)"
                    : isMedium
                    ? "rgba(245, 158, 11, 0.12)"
                    : "rgba(59, 130, 246, 0.12)",

                  color: isHigh
                    ? "#f87171"
                    : isMedium
                    ? "#fbbf24"
                    : "#60a5fa",

                  flexShrink: 0,
                }}
              >
                {level}
              </span>

              <span
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--text-hi)",
                }}
              >
                {item.text}
              </span>

            </div>
          );
        }
      )}
    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}) {
  return (
    <div>

      <div
        className="text-faint"
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 5,
        }}
      >
        {label}
      </div>

      <div
        className="mono"
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-hi)",
        }}
      >
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   QR TYPE
========================================================= */

function getQrType(
  payloadType,
  decodedData
) {
  const type =
    String(payloadType || "")
      .trim()
      .toLowerCase();

  const data =
    String(decodedData || "")
      .trim()
      .toLowerCase();

  if (
    type.includes("upi") ||
    type.includes("payment") ||
    data.startsWith("upi://")
  ) {
    return "UPI Payment";
  }

  if (
    type.includes("url") ||
    type.includes("link") ||
    data.startsWith("http://") ||
    data.startsWith("https://") ||
    data.startsWith("www.")
  ) {
    return "URL";
  }

  return "Text";
}


/* =========================================================
   QR RESULT TITLE
========================================================= */

function getQrResultTitle(
  payloadType,
  classification,
  decodedData
) {
  const type =
    String(payloadType || "")
      .trim()
      .toLowerCase();

  const data =
    String(decodedData || "")
      .trim()
      .toLowerCase();

  if (
    type.includes("upi") ||
    type.includes("payment") ||
    data.startsWith("upi://")
  ) {
    return "UPI Payment Request";
  }

  if (
    type.includes("url") ||
    type.includes("link") ||
    data.startsWith("http://") ||
    data.startsWith("https://") ||
    data.startsWith("www.")
  ) {
    return "QR Destination";
  }

  const safeClassification =
    String(classification || "")
      .trim()
      .toUpperCase();

  if (
    safeClassification &&
    ![
      "SAFE",
      "TRUSTED",
      "REAL",
      "REAL / SAFE",
    ].includes(safeClassification)
  ) {
    return safeClassification.replace(
      /\s+/g,
      " "
    );
  }

  return "QR Content";
}


/* =========================================================
   NORMALIZE QR RISK
========================================================= */

function normalizeQrRisk(
  riskLevel
) {
  const risk =
    String(riskLevel || "")
      .trim()
      .toUpperCase();

  if (
    [
      "SAFE",
      "TRUSTED",
      "REAL",
      "REAL / SAFE",
      "LOW",
    ].includes(risk)
  ) {
    return "SAFE";
  }

  if (
    [
      "MEDIUM",
      "CAUTION",
      "WARNING",
    ].includes(risk)
  ) {
    return "CAUTION";
  }

  if (risk === "HIGH") {
    return "HIGH";
  }

  if (
    [
      "CRITICAL",
      "DANGEROUS",
    ].includes(risk)
  ) {
    return "DANGEROUS";
  }

  return "";
}


/* =========================================================
   EFFECTIVE QR RISK
========================================================= */

function getEffectiveQrRisk(
  result,
  decodedData
) {
  const explicitRisk =
    normalizeQrRisk(
      result.risk_level
    );

  const classification =
    String(
      result.classification || ""
    )
      .trim()
      .toUpperCase();

  const score =
    Number(result.score);

  const indicatorCount =
    Number(result.indicator_count);

  const data =
    String(decodedData || "")
      .trim()
      .toLowerCase();

  /* -------------------------------------------------------
     DANGEROUS
  ------------------------------------------------------- */

  if (
    explicitRisk === "DANGEROUS"
  ) {
    return "DANGEROUS";
  }

  /* -------------------------------------------------------
     HIGH
  ------------------------------------------------------- */

  if (
    explicitRisk === "HIGH"
  ) {
    return "HIGH";
  }

  /* -------------------------------------------------------
     SAFE CLASSIFICATION
  ------------------------------------------------------- */

  const isSafeClassification =
    [
      "SAFE",
      "TRUSTED",
      "REAL",
      "REAL / SAFE",
    ].includes(classification);

  if (
    isSafeClassification
  ) {
    return "SAFE";
  }

  /* -------------------------------------------------------
     CAUTION
  ------------------------------------------------------- */

  if (
    explicitRisk === "CAUTION"
  ) {
    return "CAUTION";
  }

  /* -------------------------------------------------------
     SAFE
  ------------------------------------------------------- */

  if (
    explicitRisk === "SAFE"
  ) {
    return "SAFE";
  }

  /* -------------------------------------------------------
     SCORE
  ------------------------------------------------------- */

  if (
    Number.isFinite(score)
  ) {
    if (score >= 80) {
      return "SAFE";
    }

    if (score >= 50) {
      return "CAUTION";
    }

    if (score >= 25) {
      return "HIGH";
    }

    return "DANGEROUS";
  }

  /* -------------------------------------------------------
     INDICATORS
  ------------------------------------------------------- */

  if (
    Number.isFinite(indicatorCount) &&
    indicatorCount > 0
  ) {
    return "CAUTION";
  }

  return "SAFE";
}


/* =========================================================
   DISPLAY SCORE
========================================================= */

function getDisplayScore(
  result,
  riskLevel
) {
  const score =
    Number(result.score);

  if (
    Number.isFinite(score)
  ) {
    return Math.max(
      0,
      Math.min(100, score)
    );
  }

  if (
    riskLevel === "SAFE"
  ) {
    return 90;
  }

  if (
    riskLevel === "CAUTION"
  ) {
    return 60;
  }

  if (
    riskLevel === "HIGH"
  ) {
    return 35;
  }

  if (
    riskLevel === "DANGEROUS"
  ) {
    return 10;
  }

  return 50;
}


/* =========================================================
   DISPLAY COLOR
========================================================= */

function getQrDisplayColor(
  riskLevel,
  backendColor
) {
  if (
    riskLevel === "SAFE"
  ) {
    return "green";
  }

  if (
    riskLevel === "CAUTION"
  ) {
    return "yellow";
  }

  if (
    riskLevel === "HIGH"
  ) {
    return "red";
  }

  if (
    riskLevel === "DANGEROUS"
  ) {
    return "red";
  }

  return backendColor || "yellow";
}


/* =========================================================
   SHOULD USE BACKEND INDICATORS
========================================================= */

function shouldUseBackendIndicators(
  indicators,
  decodedData
) {
  if (
    !Array.isArray(indicators) ||
    indicators.length === 0
  ) {
    return false;
  }

  /*
   * UPI QR ke case mein agar backend indicators
   * generic / unrelated hain, QR-specific indicators
   * use karenge.
   */

  const isUpi =
    String(decodedData || "")
      .trim()
      .toLowerCase()
      .startsWith("upi://");

  if (isUpi) {
    const readable =
      indicators.filter(
        (item) =>
          typeof item === "string"
            ? item.trim()
            : item &&
              (
                item.text ||
                item.label ||
                item.message ||
                item.description ||
                item.reason ||
                item.indicator ||
                item.title
              )
      );

    /*
     * Agar backend ke indicators hain hi nahi
     * ya malformed hain -> fallback.
     */
    if (readable.length === 0) {
      return false;
    }
  }

  return true;
}


/* =========================================================
   NORMALIZE BACKEND INDICATORS
========================================================= */

function normalizeIndicators(
  indicators,
  riskLevel
) {
  if (
    !Array.isArray(indicators)
  ) {
    return [];
  }

  return indicators.map(
    (indicator) => {

      if (
        typeof indicator === "string"
      ) {
        return {
          level:
            riskLevel === "SAFE"
              ? "INFO"
              : riskLevel === "CAUTION"
              ? "MEDIUM"
              : riskLevel === "HIGH"
              ? "HIGH"
              : "CRITICAL",

          text: indicator,
        };
      }

      const text =
        indicator?.text ||
        indicator?.label ||
        indicator?.message ||
        indicator?.description ||
        indicator?.reason ||
        indicator?.name ||
        indicator?.indicator ||
        indicator?.value ||
        indicator?.title ||
        "Security indicator detected.";

      const originalLevel =
        String(
          indicator?.level ||
            indicator?.severity ||
            indicator?.risk ||
            indicator?.status ||
            "INFO"
        ).toUpperCase();

      if (
        riskLevel === "SAFE"
      ) {
        return {
          ...indicator,
          level: "INFO",
          text,
        };
      }

      return {
        ...indicator,
        level: originalLevel,
        text,
      };
    }
  );
}


/* =========================================================
   QR FALLBACK INDICATORS
========================================================= */

function buildQrIndicators(
  decodedData,
  riskLevel
) {
  const data =
    String(decodedData || "")
      .trim()
      .toLowerCase();

  /* =======================================================
     UPI
  ======================================================= */

  if (
    data.startsWith("upi://")
  ) {

    if (
      riskLevel === "SAFE"
    ) {
      return [
        {
          level: "INFO",
          text:
            "This QR code contains a UPI payment request.",
        },
        {
          level: "INFO",
          text:
            "Verify the recipient name and payment amount before approving the transaction.",
        },
        {
          level: "INFO",
          text:
            "Never enter your UPI PIN to receive money.",
        },
      ];
    }

    if (
      riskLevel === "CAUTION"
    ) {
      return [
        {
          level: "MEDIUM",
          text:
            "This UPI payment request requires additional verification.",
        },
        {
          level: "MEDIUM",
          text:
            "Verify the recipient name and payment amount before approving the transaction.",
        },
        {
          level: "INFO",
          text:
            "Never enter your UPI PIN to receive money.",
        },
      ];
    }

    if (
      riskLevel === "HIGH"
    ) {
      return [
        {
          level: "HIGH",
          text:
            "This UPI payment request has security concerns that should be reviewed before payment.",
        },
        {
          level: "HIGH",
          text:
            "Verify the recipient and payment amount before approving the transaction.",
        },
        {
          level: "INFO",
          text:
            "Never enter your UPI PIN to receive money.",
        },
      ];
    }

    return [
      {
        level: "CRITICAL",
        text:
          "This UPI payment request has serious security concerns.",
      },
      {
        level: "CRITICAL",
        text:
          "Do not approve the payment until the recipient and transaction details have been verified.",
      },
      {
        level: "INFO",
        text:
          "Never enter your UPI PIN to receive money.",
      },
    ];
  }


  /* =======================================================
     HTTP
  ======================================================= */

  if (
    data.startsWith("http://")
  ) {
    return [
      {
        level: "HIGH",
        text:
          "The decoded website does not use HTTPS encryption.",
      },
    ];
  }


  /* =======================================================
     HTTPS
  ======================================================= */

  if (
    data.startsWith("https://")
  ) {

    if (
      riskLevel === "SAFE"
    ) {
      return [
        {
          level: "INFO",
          text:
            "This QR code redirects to an HTTPS website.",
        },
        {
          level: "INFO",
          text:
            "Review the destination before entering personal or payment information.",
        },
      ];
    }

    if (
      riskLevel === "CAUTION"
    ) {
      return [
        {
          level: "MEDIUM",
          text:
            "This QR destination requires additional verification.",
        },
        {
          level: "MEDIUM",
          text:
            "Verify the website domain before entering login, personal, or payment information.",
        },
      ];
    }

    if (
      riskLevel === "HIGH"
    ) {
      return [
        {
          level: "HIGH",
          text:
            "The QR destination has security concerns that should be reviewed before opening it.",
        },
      ];
    }

    return [
      {
        level: "CRITICAL",
        text:
          "The QR destination has serious security concerns.",
      },
    ];
  }


  /* =======================================================
     NORMAL TEXT QR
  ======================================================= */

  if (
    riskLevel === "CAUTION"
  ) {
    return [
      {
        level: "MEDIUM",
        text:
          "This QR content requires additional verification before interaction.",
      },
    ];
  }

  if (
    riskLevel === "HIGH"
  ) {
    return [
      {
        level: "HIGH",
        text:
          "This QR content has security concerns that should be reviewed before interacting with it.",
      },
    ];
  }

  if (
    riskLevel === "DANGEROUS"
  ) {
    return [
      {
        level: "CRITICAL",
        text:
          "This QR content has serious security concerns and should not be interacted with.",
      },
    ];
  }

  return [
    {
      level: "INFO",
      text:
        "QR content was decoded successfully and no specific security indicators were detected.",
    },
  ];
}


/* =========================================================
   RECOMMENDATION PARSER
========================================================= */

function getRecommendation(
  rawRecommendation,
  decodedData,
  riskLevel
) {
  if (
    typeof rawRecommendation === "string" &&
    rawRecommendation.trim()
  ) {
    return rawRecommendation;
  }

  if (
    rawRecommendation &&
    typeof rawRecommendation === "object"
  ) {
    return (
      rawRecommendation.summary ||
      rawRecommendation.message ||
      rawRecommendation.text ||
      rawRecommendation.description ||
      getQrRecommendation(
        decodedData,
        riskLevel
      )
    );
  }

  return getQrRecommendation(
    decodedData,
    riskLevel
  );
}


/* =========================================================
   QR RECOMMENDATION
========================================================= */

function getQrRecommendation(
  decodedData,
  riskLevel
) {
  const data =
    String(decodedData || "")
      .trim()
      .toLowerCase();

  /* UPI SAFE */

  if (
    data.startsWith("upi://") &&
    riskLevel === "SAFE"
  ) {
    return (
      "This QR contains a UPI payment request. " +
      "Verify the recipient name and payment amount " +
      "before approving the transaction. Never enter " +
      "your UPI PIN to receive money."
    );
  }

  /* UPI CAUTION */

  if (
    data.startsWith("upi://") &&
    riskLevel === "CAUTION"
  ) {
    return (
      "Verify the recipient name and payment amount " +
      "carefully before approving this UPI transaction. " +
      "Do not enter your UPI PIN to receive money."
    );
  }

  /* UPI HIGH */

  if (
    data.startsWith("upi://") &&
    riskLevel === "HIGH"
  ) {
    return (
      "Do not approve this UPI payment until the " +
      "recipient, payment amount, and security concerns " +
      "have been verified."
    );
  }

  /* UPI DANGEROUS */

  if (
    data.startsWith("upi://") &&
    riskLevel === "DANGEROUS"
  ) {
    return (
      "Do not approve this UPI payment. Verify the " +
      "recipient and transaction through a trusted source " +
      "before taking any action."
    );
  }

  /* HIGH / DANGEROUS */

  if (
    riskLevel === "HIGH" ||
    riskLevel === "DANGEROUS"
  ) {
    return (
      "Do not interact with this QR destination " +
      "until its security and legitimacy have been verified."
    );
  }

  /* CAUTION */

  if (
    riskLevel === "CAUTION"
  ) {
    return (
      "Review the QR destination carefully and verify " +
      "its legitimacy before interacting with it."
    );
  }

  /* URL */

  if (
    data.startsWith("http://") ||
    data.startsWith("https://") ||
    data.startsWith("www.")
  ) {
    return (
      "Review the website destination carefully before " +
      "opening it or entering any personal, login, or " +
      "payment information."
    );
  }

  return (
    "QR content was decoded successfully. Review the " +
    "destination before interacting with it."
  );
}