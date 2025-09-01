import React from "react";

const navLinks = [
  { route: "#/", label: "Dashboard", icon: "🏠" },
  { route: "#/analytics", label: "Analytics", icon: "📊" },
  { route: "#/threats", label: "Threats", icon: "⚠️" },
  { route: "#/search", label: "Search", icon: "🔍" },
  { route: "#/settings", label: "Settings", icon: "⚙️" },
];

function SidebarNav({ open, setRoute, onClose }) {
  return (
    <aside className={`sidebar-nav${open ? " open" : ""}`}>
      <button className="sidebar-close" onClick={onClose}>
        ×
      </button>
      <ul>
        {navLinks.map((item) => (
          <li key={item.route}>
            <a
              href={item.route}
              onClick={(e) => {
                e.preventDefault();
                setRoute(item.route);
                onClose();
              }}
            >
              <span className="icon">{item.icon}</span> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default SidebarNav;
