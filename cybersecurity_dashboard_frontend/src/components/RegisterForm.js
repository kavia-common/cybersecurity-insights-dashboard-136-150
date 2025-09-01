import React, { useState } from "react";
import { useAuth } from "../AuthContext";

function RegisterForm() {
  const { register, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register(email, password);
    setLoading(false);
    if (ok) window.location.hash = "#/";
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>Register</h2>
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
          autoComplete="new-password"
          onChange={(e) => setPass(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <div style={{ marginTop: 12 }}>
        <span>
          Already have an account?{" "}
          <a href="#/login">Sign In</a>
        </span>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default RegisterForm;
