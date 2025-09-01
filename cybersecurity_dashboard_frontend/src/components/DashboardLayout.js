import React, { useState } from "react";
import TopNav from "./TopNav";
import SidebarNav from "./SidebarNav";
import WidgetGrid from "./WidgetGrid";
import NotificationsPanel from "./NotificationsPanel";
import "./DashboardLayout.css";

// PUBLIC_INTERFACE
/**
 * Modern dashboard layout combining nav, sidebar, main widgets, and notifications.
 */
function DashboardLayout({ theme, onToggleTheme, setRoute }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className={`dashboard-root theme-${theme}`}>
      <TopNav
        setRoute={setRoute}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        onToggleTheme={onToggleTheme}
        theme={theme}
        onNotificationsClick={() => setShowNotifications((v) => !v)}
      />
      <div className="dashboard-body">
        <SidebarNav
          open={sidebarOpen}
          setRoute={setRoute}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="dashboard-main-content">
          <WidgetGrid />
        </main>
        {showNotifications && (
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;
