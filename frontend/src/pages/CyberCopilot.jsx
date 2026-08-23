import { useState, useRef, useEffect } from "react";
import { api } from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { ShieldMark } from "../components/Sidebar.jsx";

const SUGGESTIONS = [
  "Is this message safe?",
  "Someone sent me a payment link. What should I do?",
  "I received a KYC message. Is it real?",
  "What should I do if I clicked a phishing link?",
];

export default function CyberCopilot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        "Hi, I'm Cyber Copilot. Ask me about a suspicious message, link, or what to do if you've been targeted.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text) {
    const question = text ?? input;

    if (!question.trim() || loading) {
      return;
    }

    // Add user message immediately
    setMessages((m) => [
      ...m,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await api.askCopilot(question);

      console.log("Cyber Copilot response:", res);

      /*
       * Backend now returns:
       *
       * {
       *   "reply": "..."
       * }
       *
       * Support old response format too.
       */
      const reply =
        typeof res === "string"
          ? res
          : res?.reply ||
            res?.answer ||
            res?.message ||
            "Sorry, I couldn't generate a response.";

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: reply,
        },
      ]);
    } catch (e) {
      console.error("Cyber Copilot error:", e);

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            "Sorry, I couldn't reach the analysis engine. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI Cyber Copilot"
        title="Cyber Copilot"
        description="Simple, understandable cybersecurity guidance — no offensive hacking help, just detection, prevention and response."
      />

      <div
        className="panel"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "60vh",
          overflow: "hidden",
        }}
      >
        {/* ================================
            CHAT AREA
        ================================= */}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((m, i) => (
            <Bubble
              key={i}
              role={m.role}
              text={m.text}
            />
          ))}

          {loading && (
            <Bubble
              role="bot"
              text="Thinking…"
            />
          )}

          <div ref={endRef} />
        </div>

        {/* ================================
            INPUT AREA
        ================================= */}

        <div
          style={{
            padding: 16,
            borderTop:
              "1px solid var(--hairline)",
          }}
        >
          {/* Suggestions */}

          <div
            className="flex gap-8"
            style={{
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="btn btn-ghost"
                style={{
                  padding: "8px 14px",
                  fontSize: 12.5,
                }}
                onClick={() => send(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}

          <div className="flex gap-12">
            <input
              type="text"
              placeholder="Ask Cyber Copilot…"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  send();
                }
              }}
              disabled={loading}
            />

            <button
              className="btn btn-primary"
              onClick={() => send()}
              disabled={
                loading || !input.trim()
              }
            >
              {loading ? "Thinking…" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   CHAT BUBBLE
========================================================= */

function Bubble({
  role,
  text,
}) {
  const isBot = role === "bot";

  return (
    <div
      className="flex gap-12"
      style={{
        alignSelf: isBot
          ? "flex-start"
          : "flex-end",

        maxWidth: "78%",

        flexDirection: isBot
          ? "row"
          : "row-reverse",
      }}
    >
      {isBot && (
        <ShieldMark size={26} />
      )}

      <div
        style={{
          background: isBot
            ? "var(--panel-raised)"
            : "linear-gradient(135deg, var(--verify), var(--ai))",

          color: isBot
            ? "var(--text-hi)"
            : "#050810",

          padding: "12px 16px",

          borderRadius: 14,

          borderTopLeftRadius:
            isBot ? 4 : 14,

          borderTopRightRadius:
            isBot ? 14 : 4,

          fontSize: 14,

          lineHeight: 1.6,

          whiteSpace: "pre-line",
        }}
      >
        {text}
      </div>
    </div>
  );
}