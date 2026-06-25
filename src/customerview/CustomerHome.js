import React, { useState } from "react";
import CustomerProducts from "./CustomerProducts";
import "./CustomerHome.css";

function CustomerHome({ customer, onLogout }) {
  const [showBuying, setShowBuying] = useState(false);

  if (!customer) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <h2>No customer data</h2>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  }

  if (showBuying) {
    return (
      <div>
        <div className="customer-home-backbar">
          <button
            onClick={() => setShowBuying(false)}
            className="customer-home-backbtn"
          >
            ← Back to Home
          </button>
        </div>
        <CustomerProducts customer={customer} />
      </div>
    );
  }

  const { CUserId, CustomerName, CEmail, CContact, CAddress, CPicName, Status } = customer;

  return (
    <div className="customer-home-wrapper">
      <div className="customer-home-card">
        <h1>Welcome</h1>

        {CPicName && (
          <img
            src={CPicName}
            height={120}
            width={120}
            className="customer-home-avatar"
            alt="customer pic"
            onError={(e) => {
              console.error("Image failed to load:", CPicName);
              e.target.style.display = "none";
            }}
          />
        )}

        <h5 className="customer-home-name">
          {CustomerName || CUserId || "Customer"}
        </h5>

        <div className="customer-home-info">
          <p><strong>User ID:</strong> {CUserId || "N/A"}</p>
          <p><strong>Email:</strong> {CEmail || "N/A"}</p>
          <p><strong>Contact:</strong> {CContact || "N/A"}</p>
          <p><strong>Address:</strong> {CAddress || "N/A"}</p>
          <p><strong>Status:</strong> {Status || "N/A"}</p>
        </div>

        <div className="customer-home-actions">
          <button
            onClick={() => setShowBuying(true)}
            className="customer-buy-btn"
          >
            🛒 Buying
          </button>
          <button
            onClick={onLogout}
            className="customer-logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerHome;
