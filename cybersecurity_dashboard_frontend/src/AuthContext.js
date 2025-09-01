import React, { createContext, useContext, useState, useEffect } from "react";
import { login, register, setAccessToken, getCurrentUser } from "./api";

const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Provides authentication methods and current user state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    () => window.localStorage.getItem("token") || null
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set access token for api.js
    if (token) setAccessToken(token);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then((u) => {
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, [token]);

  const handleLogin = async (username, password) => {
    setError(null);
    try {
      const resp = await login(username, password);
      setToken(resp.access_token);
      window.localStorage.setItem("token", resp.access_token);
      setAccessToken(resp.access_token);
      const me = await getCurrentUser();
      setUser(me);
      return true;
    } catch (err) {
      setError(err?.detail || "Login failed");
      return false;
    }
  };

  const handleRegister = async (email, password) => {
    setError(null);
    try {
      await register(email, password);
      return await handleLogin(email, password);
    } catch (err) {
      setError(err?.detail || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * Consume authentication context.
 */
export function useAuth() {
  return useContext(AuthContext);
}
