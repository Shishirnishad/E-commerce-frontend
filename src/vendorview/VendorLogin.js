import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./VendorLogin.css";
import AdBackground from "../common/AdBackground";

function VendorLogin({ onLogin }) {
  const [vuid, setVuid] = useState("");
  const [vupass, setVupass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [forgotMsg, setForgotMsg] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${REACT_APP_BASE_API_URL}/vendor/login`,
        { VUserId: vuid, VUserPass: vupass }
      );

      if (res.data && res.data.VUserId) {
        if (res.data.Status === "Inactive") {
          alert("User not active. Please wait for admin activation.");
          return;
        }
        if (onLogin) onLogin(res.data);
      } else {
        alert("Invalid login");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) {
      setForgotMsg({ type: "error", text: "Please enter your registered email" });
      return;
    }
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await axios.post(`${REACT_APP_BASE_API_URL}/vendor/sendotp`, {
        email: forgotEmail,
      });
      setForgotMsg({ type: "success", text: res.data });
      setForgotStep(2);
    } catch (err) {
      setForgotMsg({ type: "error", text: err.response?.data || "Failed to send OTP" });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setForgotMsg({ type: "error", text: "Please enter the OTP" });
      return;
    }
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await axios.post(`${REACT_APP_BASE_API_URL}/vendor/verifyotp`, {
        email: forgotEmail,
        otp,
      });
      setForgotMsg({ type: "success", text: res.data });
      setForgotStep(3);
    } catch (err) {
      setForgotMsg({ type: "error", text: err.response?.data || "Invalid OTP" });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPass.length < 6) {
      setForgotMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    if (newPass !== confirmNewPass) {
      setForgotMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await axios.put(`${REACT_APP_BASE_API_URL}/vendor/resetpassword`, {
        email: forgotEmail,
        password: newPass,
      });
      setForgotMsg({ type: "success", text: res.data });
      setTimeout(() => {
        setShowForgot(false);
        setForgotStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPass("");
        setConfirmNewPass("");
        setForgotMsg(null);
      }, 2000);
    } catch (err) {
      setForgotMsg({ type: "error", text: err.response?.data || "Password reset failed" });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="vendorlogin-container">
      <AdBackground />
      <div className="vendorlogin-form">
        <h4 className="vendorlogin-title">Vendor Login</h4>

        <input
          type="text"
          placeholder="Vendor User ID"
          value={vuid}
          onChange={(e) => setVuid(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={vupass}
            onChange={(e) => setVupass(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowPass(!showPass)}>
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="forgot-link" onClick={() => setShowForgot(true)}>
          Forgot Password?
        </button>

        <button className="vendorlogin-button" onClick={handleLogin}>
          Login
        </button>
      </div>

      {showForgot && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>Reset Password</h3>
              <button
                onClick={() => { setShowForgot(false); setForgotStep(1); setForgotMsg(null); }}
                style={closeBtnStyle}
              >✕</button>
            </div>

            {forgotMsg && (
              <div style={{
                padding: "10px 14px",
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 13,
                fontWeight: 500,
                background: forgotMsg.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: forgotMsg.type === "success" ? "#059669" : "#dc2626",
                border: `1px solid ${forgotMsg.type === "success" ? "#a7f3d0" : "#fca5a5"}`,
              }}>
                {forgotMsg.text}
              </div>
            )}

            {forgotStep === 1 && (
              <div>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
                  Enter your registered email to receive an OTP.
                </p>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={modalInputStyle}
                />
                <button onClick={handleSendOtp} disabled={forgotLoading} style={modalBtnStyle}>
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {forgotStep === 2 && (
              <div>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
                  Enter the OTP sent to your registered email.
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={modalInputStyle}
                />
                <button onClick={handleVerifyOtp} disabled={forgotLoading} style={modalBtnStyle}>
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {forgotStep === 3 && (
              <div>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
                  Enter your new password.
                </p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  style={modalInputStyle}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  style={{ ...modalInputStyle, marginTop: 10 }}
                />
                <button onClick={handleResetPassword} disabled={forgotLoading} style={modalBtnStyle}>
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#ffffff",
  borderRadius: 16,
  padding: "28px 32px",
  width: "90%",
  maxWidth: 400,
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  border: "1px solid #f0ece6",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const modalTitleStyle = {
  margin: 0,
  fontSize: 20,
  fontWeight: 700,
  color: "#FF9900",
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: 20,
  cursor: "pointer",
  color: "#9ca3af",
  padding: "4px 8px",
};

const modalInputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "1.5px solid #e0d6cc",
  borderRadius: 10,
  fontSize: 14,
  outline: "none",
  background: "#F3F3F3",
  color: "#0F1111",
  fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
  marginBottom: 12,
};

const modalBtnStyle = {
  width: "100%",
  padding: "12px 0",
  background: "linear-gradient(135deg, #F08804, #FF9900, #232F3E)",
  color: "#ffffff",
  border: "none",
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  marginTop: 4,
};

export default VendorLogin;
