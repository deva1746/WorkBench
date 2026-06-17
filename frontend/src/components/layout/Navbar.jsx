import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";

export default function Navbar({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const titleMap = {
    "/dashboard": "Dashboard",
    "/tasks": "Tasks",
    "/settings": "Settings",
  };

  const pageTitle =
    titleMap[location.pathname] || "WorkBench - Centralized Workspace for Teams and Tasks";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle btn-icon"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <span
          style={{
            fontWeight: 600,
            fontSize: "0.9375rem",
          }}
        >
          {pageTitle}
        </span>
      </div>

      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}