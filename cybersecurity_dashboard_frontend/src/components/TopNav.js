import React from "react";
import { useAuth } from "../AuthContext";

function TopNav({
  onToggleSidebar,
  onToggleTheme,
  onNotificationsClick,
  theme,
  setRoute
}) {
  // Just get the dummy user for display, logout not needed
  const { user } = useAuth();

  return (
    <nav className="topnav">
      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        ☰
      </button>
      <span
        className="brand"
        onClick={() => setRoute("#/")}
        style={{ color: "var(--accent-color, #ffab00)" }}
      >
        🛡️ Cyber AI Dashboard
      </span>
      <form
        className="topnav-search"
        onSubmit={(e) => {
          e.preventDefault();
          setRoute("#/search");
        }}
      >
        <input placeholder="Search analytics, threats..." type="search" />
        <button>🔍</button>
      </form>
      <button className="notif-btn" onClick={onNotificationsClick} title="Notifications">
        🔔
      </button>
      <button className="theme-toggle" onClick={onToggleTheme}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <div className="user-menu">
        <span>{(user && user.email) || "Guest"}</span>
        <button onClick={() => setRoute("#/settings")} title="Settings">
          ⚙️
        </button>
        {/* Logout removed for public/guest access */}
      </div>
    </nav>
  );
}

export default TopNav;
