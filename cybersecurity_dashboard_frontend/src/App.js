import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
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
    <AuthProvider>
      <div className="App">
        <AppRoutes onToggleTheme={toggleTheme} theme={theme} />
      </div>
    </AuthProvider>
  );
}

// PUBLIC_INTERFACE
function AppRoutes({ onToggleTheme, theme }) {
  // We'll do simple routing without react-router, since it's not a required dependency.
  const [route, setRoute] = useState(window.location.hash || "#/");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handler = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  let mainView = null;
  if (route.startsWith("#/login")) {
    mainView = <LoginForm />;
  } else if (route.startsWith("#/register")) {
    mainView = <RegisterForm />;
  } else if (!isAuthenticated) {
    // Default: force auth if not logged in
    mainView = <LoginForm />;
  } else if (route.startsWith("#/settings")) {
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
