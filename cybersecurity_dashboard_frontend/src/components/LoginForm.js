import React, { useState } from "react";
import { useAuth } from "../AuthContext";

function LoginForm() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    setSuccess(ok);
    if (ok) window.location.hash = "#/";
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>Sign In</h2>
      <label>
        Email
        <input
          value={email}
          type="email"
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          value={password}
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPass(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <div style={{ marginTop: 12 }}>
        <span>
          Don&apos;t have an account?{" "}
          <a href="#/register">Register</a>
        </span>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default LoginForm;
