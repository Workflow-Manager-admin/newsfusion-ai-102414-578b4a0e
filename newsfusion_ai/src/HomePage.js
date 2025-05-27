import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import ArticleDetailView from "./ArticleDetailView";

// PUBLIC_INTERFACE
export const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Politics", value: "politics" },
  { label: "Health", value: "health" },
  { label: "Sports", value: "sports" },
  { label: "Entertainment", value: "entertainment" }
];
const NEWS_API_KEY = "752d30fff1124135a2ecb248c652fe37";
const API_URL = "https://newsapi.org/v2/top-headlines";
const COUNTRY = "us";

// PUBLIC_INTERFACE
function HomePage({ theme, setTheme }) {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // We keep a ref to the interval so it can be cleared on unmount/category change
  const intervalRef = useRef();

  // PUBLIC_INTERFACE
  const fetchArticles = useCallback(
    async (selectedCategory, showLoading=true) => {
      if (showLoading) setLoading(true);
      setErr(null);
      setArticles([]);
      let url = `${API_URL}?country=${COUNTRY}&apiKey=${NEWS_API_KEY}`;
      if (selectedCategory && selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch news data.");
        const data = await res.json();
        if (data.status !== "ok") throw new Error(data.message || "API error");
        let sorted = data.articles
          .filter((a) => a.title && a.publishedAt)
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setArticles(sorted);
        setLastUpdated(new Date());
      } catch (e) {
        setErr(e.message);
      }
      if (showLoading) setLoading(false);
    }, []
  );

  // On category change: fetch immediately, then set up interval polling
  useEffect(() => {
    fetchArticles(category);

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set up interval for refreshing every 90 seconds
    intervalRef.current = setInterval(() => {
      fetchArticles(category, false);
    }, 90000);

    // Clean up on category change or unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [category, fetchArticles]);

  // PUBLIC_INTERFACE
  function handleCategoryChange(val) {
    setCategory(val);
  }

  // PUBLIC_INTERFACE
  function handleNewsCardClick(article) {
    setSelectedArticle(article);
  }

  // PUBLIC_INTERFACE
  function handleCloseDetail() {
    setSelectedArticle(null);
  }

  return (
    <div className={`homepage ${theme}`}>
      <div className="filters-row">
        <CategoryFilters selected={category} onChange={handleCategoryChange} />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <div style={{marginBottom: 12, fontSize: "1.01rem", color: "var(--text-secondary)", minHeight: 26}}>
        {lastUpdated && (
          <span>
            Last updated:{" "}
            <span style={{color: "var(--kavia-orange)", fontWeight: 500}}>
              {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
            </span>
          </span>
        )}
      </div>
      {selectedArticle ? (
        <ArticleDetailView
          article={selectedArticle}
          onClose={handleCloseDetail}
          theme={theme}
        />
      ) : (
        <>
          {loading && (
            <div className="loaderwrap">
              <Spinner />
            </div>
          )}
          {err && <div className="errmsg">⚠️ {err}</div>}
          {!loading && !err && (
            <div className="news-grid">
              {articles.length === 0 ? (
                <div className="noresults">No news articles found.</div>
              ) : (
                articles.map((article, i) => (
                  <NewsCard
                    {...article}
                    key={article.url || i}
                    onClick={() => handleNewsCardClick(article)}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
// PUBLIC_INTERFACE
function CategoryFilters({ selected, onChange }) {
  return (
    <div className="filters">
      {CATEGORIES.map(cat =>
        <button
          key={cat.value}
          className={`category-btn${selected === cat.value ? " active" : ""}`}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </button>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className={`btn theme-toggle${theme === "dark" ? " dark" : ""}`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark/light mode"
      style={{ marginLeft: 20 }}
    >
      {theme === "dark" ? "🌑 Dark" : "🌕 Light"}
    </button>
  );
}

// PUBLIC_INTERFACE
function Spinner() {
  return (
    <div className="spinner" aria-label="Loading">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  );
}

// PUBLIC_INTERFACE
function NewsCard({
  title,
  description,
  url,
  urlToImage,
  source,
  publishedAt,
  onClick,
}) {
  const prettyTime = publishedAt ? new Date(publishedAt).toLocaleString() : "";
  return (
    <div
      className="news-card"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
      style={{ cursor: onClick ? "pointer" : undefined }}
      aria-label={title}
      role={onClick ? "button" : undefined}
    >
      {urlToImage && (
        <div className="card-imgwrap">
          <img src={urlToImage} alt="" className="card-img" />
        </div>
      )}
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">
            {/* Use anchor only in Detail, here for visual click */}
            {title}
          </h3>
        </div>
        <div className="card-meta">
          <span className="card-source">{source?.name || "Unknown"}</span>
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

export default HomePage;
