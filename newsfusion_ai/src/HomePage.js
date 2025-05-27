import React from "react";
import "./App.css";
import LatestNews from "./LatestNews";

// PUBLIC_INTERFACE
/**
 * HomePage: Main landing/news feed. Renders real-time headlines via <LatestNews />,
 * providing current headlines and filtered categories. Old pre-existing news logic is removed.
 * Props:
 *   - theme ("light"|"dark")
 *   - setTheme (function to toggle theme)
 */
function HomePage({ theme, setTheme }) {
  return (
    <div className={`homepage ${theme}`}>
      <div className="filters-row" style={{ marginBottom: 12 }}>
        {/* Only the theme toggle remains since LatestNews renders its own filters */}
        <div style={{ flex: 1 }} />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      {/* Central: real-time news feed */}
      <LatestNews theme={theme} accent="var(--kavia-orange)" />
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

export default HomePage;
