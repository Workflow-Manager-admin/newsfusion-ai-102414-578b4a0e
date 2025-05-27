import React, { useState } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * ArticleDetailView component displays a news article in detail with "Summarize" functionality.
 * Props:
 * - article: {
 *     title,
 *     description,
 *     content,
 *     url,
 *     urlToImage,
 *     source,
 *     publishedAt
 *   }
 * - onClose: () => void
 * - theme: "light" | "dark"
 */
function ArticleDetailView({ article, onClose, theme }) {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // PUBLIC_INTERFACE
  const handleSummarize = async () => {
    setSummary(null);
    setSummaryError(null);
    setSummaryLoading(true);

    // Mocked API: Simulate a fetch to an AI summarizer with a delay
    // Replace this with real API integration as needed
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      if (!article.content && !article.description) {
        throw new Error("No article content available to summarize.");
      }
      // Fake summary, using first ~40 words or "description"
      const base =
        article.content ||
        article.description ||
        "No content available for this article.";
      const snippet = base.split(/\s+/).slice(0, 40).join(" ");
      setSummary(
        snippet +
          (snippet.length < base.length ? " ..." : "") +
          "\n\nAI Summary: This article covers the main points as requested."
      );
    } catch (e) {
      setSummaryError(e.message || "Failed to summarize this article.");
    }
    setSummaryLoading(false);
  };

  if (!article) return null;

  const prettyTime = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString()
    : "";

  return (
    <div
      className={`container ${
        (theme === "light" ? "light" : "") + " article-detail-view"
      }`}
      style={{
        background: "var(--card-bg)",
        borderRadius: 14,
        boxShadow: "0 3px 13px var(--card-shadow)",
        padding: 0,
        maxWidth: 678,
        margin: "40px auto",
        position: "relative",
      }}
      data-testid="article-detail"
    >
      <button
        aria-label="Back"
        className="btn"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 13,
          right: 16,
          background: "transparent",
          border: "none",
          color: "var(--kavia-orange)",
          fontWeight: 600,
          fontSize: 24,
          cursor: "pointer",
        }}
      >
        ×
      </button>
      {article.urlToImage && (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            background: "#111",
            minHeight: 180,
            maxHeight: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={article.urlToImage}
            alt=""
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 260,
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <div style={{ padding: 28 }}>
        <h2 className="card-title" style={{ fontSize: "2rem", marginBottom: 7 }}>
          {article.title}
        </h2>
        <div className="card-meta" style={{ marginBottom: 14 }}>
          <span className="card-source" style={{ fontSize: "1.1rem" }}>
            {article.source?.name || "Unknown"}
          </span>
          <span className="card-dot" style={{ fontSize: "1.17rem" }}>
            ·
          </span>
          <span className="card-time">{prettyTime}</span>
        </div>
        <div style={{ marginBottom: 15 }}>
          {article.description && (
            <div
              style={{
                color: "var(--text-secondary)",
                marginBottom: 6,
                fontSize: "1.08rem",
              }}
            >
              {article.description}
            </div>
          )}
          {article.content ? (
            <div
              style={{
                fontSize: "1.08rem",
                lineHeight: 1.55,
                marginBottom: 6,
                color: "var(--text-color)",
                wordBreak: "break-word",
              }}
            >
              {article.content.replace(/\s*\[\+\d+ chars]/, "")}
            </div>
          ) : (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-title"
              style={{ color: "var(--kavia-orange)", fontWeight: 600 }}
            >
              Read full article
            </a>
          )}
        </div>
        <button
          className="btn"
          style={{
            background: "var(--kavia-orange)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.08rem",
            border: "none",
            borderRadius: 7,
            padding: "10px 24px",
            margin: "17px 0 5px 0",
            cursor: "pointer",
            display: "block",
          }}
          disabled={summaryLoading}
          onClick={handleSummarize}
        >
          {summaryLoading ? "Summarizing..." : "Summarize"}
        </button>
        {summaryLoading && (
          <div className="loaderwrap" style={{ margin: "18px 0" }}>
            <Spinner />
          </div>
        )}
        {summaryError && (
          <div className="errmsg" style={{ margin: "18px 0" }}>
            {summaryError}
          </div>
        )}
        {summary && (
          <div
            style={{
              marginTop: 19,
              background: "var(--kavia-secondary)",
              padding: 18,
              borderRadius: 7,
              color: "var(--text-color)",
              fontSize: "1.09rem",
              whiteSpace: "pre-wrap",
              boxShadow: "0 1px 6px rgba(0,0,0,0.09)",
              border: "1px solid var(--border-color)",
            }}
            data-testid="summary-box"
          >
            <strong style={{ color: "var(--kavia-orange)" }}>Summary:</strong>
            <div>{summary}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Spinner reused for loading state
function Spinner() {
  return (
    <div className="spinner" aria-label="Loading">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  );
}

export default ArticleDetailView;
