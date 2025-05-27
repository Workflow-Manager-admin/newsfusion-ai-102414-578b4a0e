import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// PUBLIC_INTERFACE
/**
 * LatestNews: Fetches and displays the latest news headlines from NewsAPI.org.
 * - Props:
 *    - category: string (news category, default: "all")
 *    - theme: "dark"|"light" (default: "dark")
 *    - accent: string (accent color, default: "#f56565")
 *
 * UI:
 * - Card-based grid layout in dark-theme
 * - Last-updated indicator (no auto-refresh)
 * - User-friendly error states
 * - Responsive mobile/desktop
 */
const NEWS_API_KEY = "752d30fff1124135a2ecb248c652fe37"; // demo
const API_URL = "https://newsapi.org/v2/top-headlines";
const COUNTRY = "us";

// Mapping from UI label/value to NewsAPI-supported category
const CATEGORY_MAP = {
  all: "",
  technology: "technology",
  // Map 'Politics' (UI value 'politics') to NewsAPI 'general'
  politics: "general",
  health: "health",
  sports: "sports",
  entertainment: "entertainment"
};

// UI categories for display—some map to supported categories underneath
const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Politics", value: "politics" },
  { label: "Health", value: "health" },
  { label: "Sports", value: "sports" },
  { label: "Entertainment", value: "entertainment" }
];

// For error diagnostics
const NEWSAPI_SUPPORTED_CATEGORIES = [
  "business", "entertainment", "general", "health", "science", "sports", "technology"
];

// PUBLIC_INTERFACE
function LatestNews({
  category: initialCategory = "all",
  theme = "dark",
  accent = "#f56565"
}) {
  const [category, setCategory] = useState(initialCategory);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // PUBLIC_INTERFACE
  // fetch news from NewsAPI, given category
  const fetchHeadlines = async (selCategory, showLoading = true) => {
    if (showLoading) setLoading(true);
    setErr(null);

    // Map the selected category value to NewsAPI-supported value
    // If not supported, report a user-facing error
    const mappedCat = CATEGORY_MAP[selCategory] !== undefined ? CATEGORY_MAP[selCategory] : undefined;

    if (mappedCat === undefined) {
      setErr(`Selected category "${selCategory}" is not supported. Please choose a different category.`);
      setArticles([]);
      if (showLoading) setLoading(false);
      return;
    }

    // If a mapped category is present and not the empty string, ensure it's in NewsAPI's supported list. ('general' is for 'Politics')
    if (mappedCat && !NEWSAPI_SUPPORTED_CATEGORIES.includes(mappedCat)) {
      setErr(`Internal error: Category "${mappedCat}" is not a NewsAPI-supported category.`);
      setArticles([]);
      if (showLoading) setLoading(false);
      return;
    }

    let url = `${API_URL}?country=${COUNTRY}&apiKey=${NEWS_API_KEY}`;
    // Only include category if mappedCat is not empty ('All' maps to "")
    if (mappedCat) {
      url += `&category=${mappedCat}`;
    }
    try {
      const res = await fetch(url);
      let responseText;
      let data;
      if (!res.ok) {
        // Try to extract error details from NewsAPI or network
        try {
          responseText = await res.text();
          data = JSON.parse(responseText);
        } catch {
          data = null;
        }
        let errorMsg = "Failed to fetch news data!";
        // Show NewsAPI errors if available
        if (data && data.message) {
          errorMsg += ` API response: ${data.message}`;
        } else if (res.status === 401) {
          errorMsg += " The API key is missing or invalid (HTTP 401 Unauthorized).";
        } else if (res.status === 426 || res.status === 403 || res.status === 429) {
          errorMsg += " You may have reached your API quota or your API key is restricted.";
        } else if (res.status === 400) {
          errorMsg += " Bad request (HTTP 400)—invalid parameters supplied to API.";
        }
        errorMsg += ` (HTTP status: ${res.status})`;
        setErr(errorMsg);
        setArticles([]);
        if (showLoading) setLoading(false);
        return;
      }
      try {
        data = await res.json();
      } catch (jsonErr) {
        setErr("The server response was not valid JSON. This may indicate a problem with CORS or endpoint configuration.");
        setArticles([]);
        if (showLoading) setLoading(false);
        return;
      }
      if (data.status !== "ok") {
        let apiMsg = data.message ? ` NewsAPI: ${data.message}` : "";
        setErr("News fetching failed." + apiMsg);
        setArticles([]);
        if (showLoading) setLoading(false);
        return;
      }
      let sorted = data.articles
        .filter(a => a.title && a.publishedAt)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setArticles(sorted);
      setLastUpdated(new Date());
    } catch (e) {
      let errMsg = e && e.message ? e.message : "An error occurred loading news.";
      // Browser CORS/network failures
      if (
        /Failed to fetch/i.test(errMsg) ||
        /NetworkError/i.test(errMsg) ||
        /TypeError: Failed to fetch/.test(errMsg)
      ) {
        errMsg += " (Network error: This may be due to a CORS policy restriction, internet failure, or browser/network blocking cross-origin requests. Check your console Network tab for more info.)";
      }
      setErr(errMsg);
      setArticles([]);
    }
    if (showLoading) setLoading(false);
  };

  // Fetch news only on mount and category change—no polling/interval
  useEffect(() => {
    fetchHeadlines(category);
    // No setInterval, so nothing to clean up.
    // eslint-disable-next-line
  }, [category]);

  // PUBLIC_INTERFACE
  function handleCategoryChange(val) {
    // val is the UI-selected value ('politics', etc.) which may be remapped internally
    setCategory(val);
  }

  // UI render
  return (
    <div className={`latest-news${theme === "light" ? " light" : ""}`}>
      <div className="filters-row">
        <div className="filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`category-btn${category === cat.value ? " active" : ""}`}
              onClick={() => handleCategoryChange(cat.value)}
              style={
                category === cat.value
                  ? { background: accent }
                  : undefined
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span
          style={{
            marginLeft: 18,
            color: "var(--text-secondary)",
            fontSize: "1.04rem"
          }}
        >
          <span
            style={{
              color: accent,
              fontWeight: 500
            }}
          >
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : ""}
          </span>
        </span>
      </div>
      {loading && (
        <div className="loaderwrap">
          <NewsSpinner accent={accent} />
        </div>
      )}
      {err && <div className="errmsg">⚠️ {err}</div>}
      {!loading && !err && (
        <div className="news-grid">
          {articles.length === 0 ? (
            <div className="noresults" style={{ color: accent }}>
              No news articles found.
            </div>
          ) : (
            articles.map((article, i) => (
              <NewsCard key={article.url || i} article={article} accent={accent} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function NewsCard({ article, accent }) {
  const { title, description, url, urlToImage, source, publishedAt } = article;
  const prettyTime = publishedAt ? new Date(publishedAt).toLocaleString() : "";
  return (
    <div className="news-card" tabIndex={0} style={{ borderColor: accent, boxShadow: "0 3px 12px var(--card-shadow)" }}>
      {urlToImage && (
        <div className="card-imgwrap">
          <img src={urlToImage} alt="" className="card-img" />
        </div>
      )}
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: accent, borderBottom: `2px solid ${accent}` }}
              >
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
        </div>
        <div className="card-meta">
          <span className="card-source" style={{ color: accent }}>
            {source?.name || "Unknown"}
          </span>
          <span className="card-dot">·</span>
          <span className="card-time">{prettyTime}</span>
        </div>
        <p className="card-desc">
          {description || <span className="card-no-desc">No description</span>}
        </p>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function NewsSpinner({ accent }) {
  return (
    <div className="spinner" aria-label="Loading">
      <div className="bounce1" style={{ backgroundColor: accent }} />
      <div className="bounce2" style={{ backgroundColor: accent }} />
      <div className="bounce3" style={{ backgroundColor: accent }} />
    </div>
  );
}

export default LatestNews;
