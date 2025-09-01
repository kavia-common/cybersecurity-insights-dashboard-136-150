import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import Settings from "./components/Settings";
import SearchPage from "./components/SearchPage";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <AppRoutes onToggleTheme={toggleTheme} theme={theme} />
    </div>
  );
}

// PUBLIC_INTERFACE
function AppRoutes({ onToggleTheme, theme }) {
  // Route state for navigation (simple hash-based)
  const [route, setRoute] = useState(window.location.hash || "#/");

  useEffect(() => {
    const handler = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  let mainView = null;
  // Hide Login and Register routes - always render dashboard, settings, or search for all visitors
  if (route.startsWith("#/settings")) {
    mainView = <Settings />;
  } else if (route.startsWith("#/search")) {
    mainView = <SearchPage />;
  } else {
    // Main dashboard
    mainView = (
      <DashboardLayout
        theme={theme}
        onToggleTheme={onToggleTheme}
        setRoute={setRoute}
      />
    );
  }

  return <>{mainView}</>;
}

export default App;
