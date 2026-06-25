import React, { useState } from "react";
import axios from "axios";

function VendorProfileEdit({ vendor, onUpdate, onBack }) {
  const [form, setForm] = useState({
    VendorName: vendor.VendorName || "",
    VEmail: vendor.VEmail || "",
    VContact: vendor.VContact || "",
    VAddress: vendor.VAddress || "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(vendor.VPicName || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("VendorName", form.VendorName);
      fd.append("VEmail", form.VEmail);
      fd.append("VContact", form.VContact);
      fd.append("VAddress", form.VAddress);
      if (file) fd.append("file", file);

      const res = await axios.put(
        `${REACT_APP_BASE_API_URL}/vendor/update/${vendor.VUserId}`,
        fd
      );

      if (onUpdate) {
        onUpdate({
          ...vendor,
          VendorName: form.VendorName,
          VEmail: form.VEmail,
          VContact: form.VContact,
          VAddress: form.VAddress,
          VPicName: preview || vendor.VPicName,
        });
      }

      setMsg({ type: "success", text: res.data.message || "Profile updated successfully" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Profile</h2>
          <button onClick={onBack} style={styles.backBtn}>← Back</button>
        </div>

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
          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              {preview ? (
                <img src={preview} alt="preview" style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {form.VendorName.charAt(0).toUpperCase() || "V"}
                </div>
              )}
            </div>
            <label style={styles.uploadLabel}>
              Change Photo
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            </label>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              name="VendorName"
              value={form.VendorName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              name="VEmail"
              type="email"
              value={form.VEmail}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="VContact"
              value={form.VContact}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Address</label>
            <textarea
              name="VAddress"
              value={form.VAddress}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Saving..." : "Save Changes"}
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
    maxWidth: 520,
    padding: "36px 40px",
    marginTop: 20,
    position: "relative",
    zIndex: 1,
    animation: "cardEnter 0.6s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#FF9900",
    letterSpacing: "-0.5px",
  },
  backBtn: {
    padding: "10px 20px",
    background: "#F3F3F3",
    color: "#0F1111",
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
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid rgba(255, 153, 0, 0.3)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #F08804, #232F3E)",
    color: "#ffffff",
    fontSize: 36,
    fontWeight: 700,
  },
  uploadLabel: {
    padding: "8px 20px",
    background: "#F3F3F3",
    color: "#0F1111",
    border: "1px solid #e0d6cc",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
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
  input: {
    padding: "12px 16px",
    border: "1.5px solid #e0d6cc",
    borderRadius: 12,
    fontSize: 15,
    outline: "none",
    transition: "all 0.25s",
    width: "100%",
    boxSizing: "border-box",
    background: "#F3F3F3",
    color: "#0F1111",
    fontFamily: "'Inter', sans-serif",
  },
  submitBtn: {
    marginTop: 8,
    padding: "14px 0",
    background: "linear-gradient(135deg, #F08804, #FF9900, #232F3E)",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 6px 20px rgba(240, 136, 4, 0.3)",
  },
};

export default VendorProfileEdit;
