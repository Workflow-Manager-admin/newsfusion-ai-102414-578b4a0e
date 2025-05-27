import React, { useState, useEffect } from "react";
import "./App.css";
import HomePage from "./HomePage";

function App() {
  const userPreferred =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || userPreferred
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`app ${theme}`}>
      <nav className="navbar">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div className="logo">
              <span className="logo-symbol">*</span> NewsFusion AI
            </div>
            <span style={{ fontWeight: 500, color: "var(--kavia-orange)" }}>
              Real-Time News Aggregator
            </span>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{ marginTop: 88 }}>
          <HomePage theme={theme} setTheme={setTheme} />
        </div>
      </main>
    </div>
  );
}

export default App;