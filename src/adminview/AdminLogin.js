import React, { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";
import AdBackground from "../common/AdBackground";

const BASE = process.env.REACT_APP_BASE_API_URL;

function AdminLogin({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!userId.trim() || !password.trim()) {
      setError("Please enter User ID and Password");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE}/admin/login`, { userId, password });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <AdBackground />
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <div className="admin-icon">🛡️</div>
        <h1>Admin <span>Panel</span></h1>
        <p className="admin-login-sub">Sign in to manage your marketplace</p>
        <label>User ID</label>
        <input
          type="text"
          placeholder="Enter admin user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          autoFocus
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="admin-login-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <p className="admin-login-error">{error}</p>}
      </form>
    </div>
  );
}

export default AdminLogin;
