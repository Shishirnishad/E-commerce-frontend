import React, { useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import StateMgt from "../AdminViews/StateMgt";
import CityMgt from "../AdminViews/CityMgt";
import ProductMgt from "../AdminViews/ProductMgt";

const BASE = process.env.REACT_APP_BASE_API_URL;

const TABS = [
  { key: "state", label: "State", icon: "🏛️" },
  { key: "city", label: "City", icon: "🏙️" },
  { key: "productcatg", label: "Product Category", icon: "📦" },
  { key: "vendors", label: "Vendors", icon: "🏪" },
  { key: "customers", label: "Customers", icon: "🛒" },
];

function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState("state");
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/admin/vendors`);
      setVendors(res.data);
    } catch (err) {
      alert("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/admin/customers-with-purchases`);
      setCustomers(res.data);
    } catch (err) {
      alert("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "vendors" && vendors.length === 0) fetchVendors();
    if (key === "customers" && customers.length === 0) fetchCustomers();
  };

  const toggleVendorStatus = async (vid, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setToggling(`v-${vid}`);
    try {
      await axios.put(`${BASE}/vendor/Vendermanage/${vid}/${newStatus}`);
      setVendors((prev) =>
        prev.map((v) => (v.VId === vid ? { ...v, Status: newStatus } : v))
      );
    } catch (err) {
      alert("Failed to update vendor status");
    } finally {
      setToggling(null);
    }
  };

  const toggleCustomerStatus = async (cid, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setToggling(`c-${cid}`);
    try {
      await axios.put(`${BASE}/customer/Customermanage/${cid}/${newStatus}`);
      setCustomers((prev) =>
        prev.map((c) => (c.CId === cid ? { ...c, Status: newStatus } : c))
      );
    } catch (err) {
      alert("Failed to update customer status");
    } finally {
      setToggling(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "state":
        return <StateMgt />;
      case "city":
        return <CityMgt />;
      case "productcatg":
        return <ProductMgt />;
      case "vendors":
        return (
          <section className="admin-dash-section">
            <h2>Vendor Detailed List ({vendors.length})</h2>
            {loading ? (
              <div className="admin-dash-loading">Loading vendors...</div>
            ) : (
              <div className="admin-dash-table-wrap">
                <table className="admin-dash-table">
                  <thead>
                    <tr>
                      <th>VId</th>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Action</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.length === 0 ? (
                      <tr><td colSpan="9" className="admin-empty">No vendors found</td></tr>
                    ) : vendors.map((v) => (
                      <React.Fragment key={v.VId}>
                        <tr
                          className="admin-dash-row"
                          onClick={() => setExpandedVendor(expandedVendor === v.VId ? null : v.VId)}
                        >
                          <td>{v.VId}</td>
                          <td>{v.VUserId}</td>
                          <td>{v.VendorName}</td>
                          <td>{v.VEmail}</td>
                          <td>{v.VContact || "—"}</td>
                          <td>{v.VAddress || "—"}</td>
                          <td>
                            <span className={`admin-status ${v.Status === "Active" ? "active" : "inactive"}`}>
                              {v.Status}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`admin-toggle-btn ${v.Status === "Active" ? "disable" : "activate"}`}
                              onClick={(e) => { e.stopPropagation(); toggleVendorStatus(v.VId, v.Status); }}
                              disabled={toggling === `v-${v.VId}`}
                            >
                              {toggling === `v-${v.VId}` ? "..." : v.Status === "Active" ? "Disable" : "Activate"}
                            </button>
                          </td>
                          <td className="admin-expand-icon">{expandedVendor === v.VId ? "▲" : "▼"}</td>
                        </tr>
                        {expandedVendor === v.VId && (
                          <tr className="admin-dash-expanded">
                            <td colSpan="9">
                              <div className="admin-expand-content">
                                <div className="admin-expand-grid">
                                  <div><strong>VId:</strong> {v.VId}</div>
                                  <div><strong>User ID:</strong> {v.VUserId}</div>
                                  <div><strong>Name:</strong> {v.VendorName}</div>
                                  <div><strong>Email:</strong> {v.VEmail}</div>
                                  <div><strong>Contact:</strong> {v.VContact || "—"}</div>
                                  <div><strong>Address:</strong> {v.VAddress || "—"}</div>
                                  <div><strong>Status:</strong> {v.Status}</div>
                                  {v.VPicName && (
                                    <div>
                                      <strong>Photo:</strong>
                                      <img src={v.VPicName} alt="" className="admin-thumb" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      case "customers":
        return (
          <section className="admin-dash-section">
            <h2>Customer Purchase List ({customers.length})</h2>
            {loading ? (
              <div className="admin-dash-loading">Loading customers...</div>
            ) : (
              <div className="admin-dash-table-wrap">
                <table className="admin-dash-table">
                  <thead>
                    <tr>
                      <th>CId</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Action</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr><td colSpan="10" className="admin-empty">No customers with purchases found</td></tr>
                    ) : customers.map((c) => {
                      const totalSpent = c.purchases.reduce((s, p) => s + p.totalAmount, 0);
                      return (
                        <React.Fragment key={c.CId}>
                          <tr
                            className="admin-dash-row"
                            onClick={() => setExpandedCustomer(expandedCustomer === c.CId ? null : c.CId)}
                          >
                            <td>{c.CId}</td>
                            <td>{c.CustomerName}</td>
                            <td>{c.CEmail}</td>
                            <td>{c.CContact || "—"}</td>
                            <td>{c.CAddress || "—"}</td>
                            <td>
                              <span className={`admin-status ${c.Status === "Active" ? "active" : "inactive"}`}>
                                {c.Status || "—"}
                              </span>
                            </td>
                            <td>{c.purchases.length}</td>
                            <td>₹{totalSpent.toLocaleString()}</td>
                            <td>
                              <button
                                className={`admin-toggle-btn ${c.Status === "Active" ? "disable" : "activate"}`}
                                onClick={(e) => { e.stopPropagation(); toggleCustomerStatus(c.CId, c.Status); }}
                                disabled={toggling === `c-${c.CId}`}
                              >
                                {toggling === `c-${c.CId}` ? "..." : c.Status === "Active" ? "Disable" : "Activate"}
                              </button>
                            </td>
                            <td className="admin-expand-icon">{expandedCustomer === c.CId ? "▲" : "▼"}</td>
                          </tr>
                          {expandedCustomer === c.CId && (
                            <tr className="admin-dash-expanded">
                              <td colSpan="10">
                                <div className="admin-expand-content">
                                  <div className="admin-expand-grid">
                                    <div><strong>CId:</strong> {c.CId}</div>
                                    <div><strong>Name:</strong> {c.CustomerName}</div>
                                    <div><strong>Email:</strong> {c.CEmail}</div>
                                    <div><strong>Contact:</strong> {c.CContact || "—"}</div>
                                    <div><strong>Address:</strong> {c.CAddress || "—"}</div>
                                    {c.CUserId && <div><strong>User ID:</strong> {c.CUserId}</div>}
                                    <div><strong>Status:</strong> {c.Status || "—"}</div>
                                    {c.CPicName && (
                                      <div>
                                        <strong>Photo:</strong>
                                        <img src={c.CPicName} alt="" className="admin-thumb" />
                                      </div>
                                    )}
                                  </div>
                                  <h4 style={{ margin: "16px 0 8px", color: "#0F1111" }}>Purchase History</h4>
                                  <table className="admin-sub-table">
                                    <thead>
                                      <tr>
                                        <th>Invoice #</th>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {c.purchases.map((p) => (
                                        <tr key={p.invoiceId}>
                                          <td>#{p.invoiceId}</td>
                                          <td>{p.pname}</td>
                                          <td>₹{p.opprice}</td>
                                          <td>{p.quantity}</td>
                                          <td>₹{p.totalAmount}</td>
                                          <td>{new Date(p.invoiceDate).toLocaleDateString()}</td>
                                          <td>
                                            <span className={`admin-status ${p.status === "Paid" ? "active" : "inactive"}`}>
                                              {p.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dash">
      <div className="admin-dash-body">
        <div className="admin-dash-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`admin-dash-tab${activeTab === tab.key ? " active" : ""}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="admin-dash-tab-icon">{tab.icon}</span>
              <span className="admin-dash-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="admin-dash-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
