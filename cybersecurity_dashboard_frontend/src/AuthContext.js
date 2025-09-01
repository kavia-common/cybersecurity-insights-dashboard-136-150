import React, { createContext, useContext } from "react";

/**
 * PUBLIC_INTERFACE
 * Dummy authentication provider that always allows access.
 */
const dummyAuthObj = {
  user: { email: "Guest" },
  loading: false,
  error: null,
  // All auth methods are no-ops now
  login: async () => true,
  register: async () => true,
  logout: () => {},
  isAuthenticated: true,
};

const AuthContext = React.createContext(dummyAuthObj);

/**
 * PUBLIC_INTERFACE
 * Provides authentication methods and always allows access.
 */
export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={dummyAuthObj}>
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
