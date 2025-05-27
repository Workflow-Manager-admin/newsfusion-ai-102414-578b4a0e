import React, { useState, useEffect } from "react";
import "./App.css";
import HomePage from "./HomePage";
import CustomSummarizer from "./CustomSummarizer";

// App's simple tab-routing/navigation
const NAV_TABS = [
  { key: "home", label: "Home" },
  { key: "custom-summarizer", label: "Custom Summarizer" }
];

function App() {
  const userPreferred =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || userPreferred
  );
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  // Highlight active tab
  function renderNavbar() {
    return (
      <nav className="navbar">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div className="logo">
              <span className="logo-symbol">*</span> NewsFusion AI
            </div>
            <div style={{display: "flex", alignItems: "center", gap: 13}}>
              {/* Nav Tab Buttons */}
              {NAV_TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`category-btn${activeTab === tab.key ? " active" : ""}`}
                  style={{
                    margin: "0 4px",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    borderRadius: 19,
                    padding: "8px 19px",
                  }}
                  onClick={() => setActiveTab(tab.key)}
                  aria-current={activeTab === tab.key ? "page" : undefined}
                >
                  {tab.label}
                </button>
              ))}
              <span style={{ fontWeight: 500, color: "var(--kavia-orange)", marginLeft: 12 }}>
                Real-Time News Aggregator
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div className={`app ${theme}`}>
      {renderNavbar()}
      <main>
        {activeTab === "home" && (
          <div className="container" style={{ marginTop: 88 }}>
            <HomePage theme={theme} setTheme={setTheme} />
          </div>
        )}
        {activeTab === "custom-summarizer" && (
          <div style={{ marginTop: 88 }}>
            <CustomSummarizer theme={theme} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;