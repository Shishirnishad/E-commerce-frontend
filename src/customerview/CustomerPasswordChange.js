import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function CustomerPasswordChange({ customer, onBack }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (form.newPassword.length < 6) {
      setMsg({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${REACT_APP_BASE_API_URL}/customer/changepassword`,
        {
          CUserId: customer.CUserId,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }
      );
      setMsg({ type: "success", text: res.data });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    padding: "12px 16px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e0d6cc"}`,
    borderRadius: 12,
    fontSize: 15,
    outline: "none",
    transition: "all 0.25s",
    width: "100%",
    boxSizing: "border-box",
    paddingRight: 44,
    background: "#F3F3F3",
    color: "#0F1111",
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Change Password</h2>
          <button onClick={onBack} style={styles.backBtn}>← Back</button>
        </div>

        <p style={styles.subtitle}>Update your account password</p>

        {msg && (
          <div style={{
            ...styles.msg,
            background: msg.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: msg.type === "success" ? "#059669" : "#dc2626",
            border: `1px solid ${msg.type === "success" ? "#a7f3d0" : "#fca5a5"}`,
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Current Password</label>
            <div style={styles.passWrapper}>
              <input
                name="currentPassword"
                type={show.current ? "text" : "password"}
                value={form.currentPassword}
                onChange={handleChange}
                style={inputStyle()}
                required
              />
              <span onClick={() => toggleShow("current")} style={styles.eye}>
                {show.current ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>New Password</label>
            <div style={styles.passWrapper}>
              <input
                name="newPassword"
                type={show.new ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange}
                style={inputStyle(form.newPassword.length > 0 && form.newPassword.length < 6)}
                required
              />
              <span onClick={() => toggleShow("new")} style={styles.eye}>
                {show.new ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {form.newPassword.length > 0 && form.newPassword.length < 6 && (
              <span style={styles.hint}>Minimum 6 characters</span>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm New Password</label>
            <div style={styles.passWrapper}>
              <input
                name="confirmPassword"
                type={show.confirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                style={inputStyle(
                  form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword
                )}
                required
              />
              <span onClick={() => toggleShow("confirm")} style={styles.eye}>
                {show.confirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword && (
              <span style={styles.hint}>Passwords do not match</span>
            )}
          </div>

          <button type="submit" disabled={loading} style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#F3F3F3",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 10px 30px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.03)",
    border: "1px solid rgba(255,255,255,0.8)",
    width: "100%",
    maxWidth: 460,
    padding: "36px 40px",
    marginTop: 20,
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#FF9900",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: "0 0 24px 0",
    color: "#9ca3af",
    fontSize: 14,
  },
  backBtn: {
    padding: "10px 20px",
    background: "#F3F3F3",
    color: "#4a4a5a",
    border: "1px solid #e0d6cc",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
  },
  msg: {
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 500,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },
  passWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eye: {
    position: "absolute",
    right: 14,
    cursor: "pointer",
    color: "#9ca3af",
    fontSize: 18,
    display: "flex",
  },
  hint: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 2,
  },
  submitBtn: {
    marginTop: 8,
    padding: "14px 0",
    background: "linear-gradient(135deg, #FF9900, #F08804, #232F3E)",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 6px 20px rgba(255, 153, 0, 0.3)",
  },
};

export default CustomerPasswordChange;
