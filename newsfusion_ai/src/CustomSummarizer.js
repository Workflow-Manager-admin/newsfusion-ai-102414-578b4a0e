import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
/**
 * CustomSummarizer: Lets users paste their own article/text and get an AI summary.
 * Shows loader, handles errors, supports dark mode with app theme.
 * Props:
 *   - theme ("dark"|"light")
 */
function CustomSummarizer({ theme }) {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // PUBLIC_INTERFACE
  async function handleSummarize() {
    setLoading(true);
    setErr(null);
    setSummary(null);

    // Fake delay and logic, replace with actual AI API if needed
    try {
      await new Promise(r => setTimeout(r, 1800));
      if (!inputText.trim() || inputText.length < 20) {
        throw new Error("Please paste a longer article or paragraph to summarize.");
      }

      // Mock summary: first 40 words + AI note
      const words = inputText.trim().split(/\s+/);
      const snippet = words.slice(0, 40).join(" ");
      setSummary(
        snippet +
          (words.length > 40 ? " ..." : "") +
          "\n\nAI Summary: This text was summarized for you. (demo)"
      );
    } catch (e) {
      setErr(e.message || "Failed to summarize this text.");
    }
    setLoading(false);
  }

  const handleInputChange = e => {
    setInputText(e.target.value);
    setErr(null);
    setSummary(null);
  };

  return (
    <div
      className={`container${theme === "light" ? " light" : ""}`}
      style={{
        margin: "40px auto 0 auto",
        maxWidth: 670,
        minHeight: 425,
        padding: 0,
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 13,
          boxShadow: "0 2px 8px var(--card-shadow)",
          padding: 0,
          overflow: "hidden",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ padding: "28px 24px 10px 24px" }}>
          <h2
            className="card-title"
            style={{
              fontSize: "1.45rem",
              marginBottom: 12,
              color: "var(--kavia-orange)",
            }}
          >
            📋 Paste Your Article/Text
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: 12,
              fontSize: "1.05rem",
            }}
          >
            Paste any article or text below and click <b>Summarize This</b> to receive an AI-generated summary.
          </p>
          <textarea
            aria-label="Paste your article or text"
            value={inputText}
            onChange={handleInputChange}
            rows={10}
            className="customsum-textarea"
            placeholder="Paste your article or text here..."
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid var(--border-color)",
              fontSize: "1.07rem",
              padding: "13px 13px",
              minHeight: 120,
              background: theme === "light" ? "#fcfbf9" : "#23262F",
              color: "var(--text-color)",
              marginBottom: 15,
              resize: "vertical",
              outline: "none",
              transition: "border 0.18s",
            }}
            disabled={loading}
          />
          <button
            className="btn"
            style={{
              background: "var(--kavia-orange)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.1rem",
              border: "none",
              borderRadius: 7,
              padding: "10px 24px",
              margin: "0 0 6px 0",
              cursor: loading ? "wait" : "pointer",
              display: "block",
              minWidth: 158,
            }}
            disabled={loading || inputText.trim().length < 20}
            onClick={handleSummarize}
            aria-busy={loading}
          >
            {loading ? "Summarizing..." : "Summarize This"}
          </button>
        </div>
        {loading && (
          <div className="loaderwrap" style={{ marginTop: 19 }}>
            <SummarizerSpinner />
          </div>
        )}
        {err && (
          <div className="errmsg" style={{ marginTop: 19 }}>{err}</div>
        )}
        {summary && (
          <div
            style={{
              marginTop: 19,
              background: "var(--kavia-secondary)",
              padding: 17,
              borderRadius: 7,
              color: "var(--text-color)",
              fontSize: "1.08rem",
              whiteSpace: "pre-wrap",
              boxShadow: "0 1px 6px rgba(0,0,0,0.09)",
              border: "1px solid var(--border-color)",
            }}
            data-testid="paste-summary"
          >
            <strong style={{ color: "var(--kavia-orange)" }}>Summary:</strong>
            <div>{summary}</div>
          </div>
        )}
        <div style={{ height: 14 }} />
      </div>
    </div>
  );
}

// Spinner reused for loading state
function SummarizerSpinner() {
  return (
    <div className="spinner" aria-label="Loading">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  );
}

export default CustomSummarizer;
