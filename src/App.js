import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./NavBar.css";

import LandingPage from "./LandingPage";

import CustomerLogin from "./customerview/CustomerLogin";
import CustomerRegister from "./customerview/CustomerRegister";
import CustomerHome from "./customerview/CustomerHome";
import CustomerInvoice from "./customerview/CustomerInvoice";
import CustomerProfileEdit from "./customerview/CustomerProfileEdit";
import CustomerPasswordChange from "./customerview/CustomerPasswordChange";

import VendorLogin from "./vendorview/VendorLogin";
import VendorRegister from "./vendorview/VendorRegister";
import VendorHome from "./vendorview/VendorHome";
import VendorProductMgt from "./productview/VendorProductMgt";
import VendorProfileEdit from "./vendorview/VendorProfileEdit";
import VendorPasswordChange from "./vendorview/VendorPasswordChange";

import AdminLogin from "./adminview/AdminLogin";
import AdminDashboard from "./adminview/AdminDashboard";

const NAV = [
  { to: "/customer/login", label: "Customer Login", group: "Customer" },
  { to: "/customer/register", label: "Customer Register", group: "Customer" },
  { to: "/vendor/login", label: "Vendor Login", group: "Vendor" },
  { to: "/vendor/register", label: "Vendor Register", group: "Vendor" },
  { to: "/vendor/products", label: "Manage Products", group: "Vendor" },
  { to: "/admin/login", label: "Admin Login", group: "Admin" },
];

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const [vendor, setVendor] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("app-theme") || "light");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const user = customer || vendor || admin;
  const isCustomer = !!customer;
  const isVendor = !!vendor;
  const isAdmin = !!admin;
  const userName = customer?.CustomerName || vendor?.VendorName || admin?.name || "";
  const userPic = customer?.CPicName || vendor?.VPicName || "";

  const handleLogout = () => {
    setCustomer(null);
    setVendor(null);
    setAdmin(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const handleAdminLogin = (data) => {
    setAdmin(data);
    if (data) navigate("/admin/dashboard");
  };

  const handleCustomerLogin = (data) => {
    setCustomer(data);
    if (data) navigate("/customer/home");
  };

  const handleVendorLogin = (data) => {
    setVendor(data);
    if (data) navigate("/vendor/home");
  };

  const updateCustomer = (updated) => setCustomer(updated);
  const updateVendor = (updated) => setVendor(updated);

  function NavBar() {
    const groups = [...new Set(NAV.map((n) => n.group))];

    return (
      <nav className="navbar">
        <div className="navbar-left">
          <span className="navbar-brand">🛍️ E-Shop</span>
          {groups.map((group) => (
            <div key={group} className="navbar-group">
              <span className="navbar-group-label">{group}:</span>
              {NAV.filter((n) => n.group === group).map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `navbar-link${isActive ? " active" : ""}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {user && (
            <div ref={dropdownRef} className="navbar-user-wrap">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="user-menu-btn"
              >
                {userPic ? (
                  <img src={userPic} alt="" className="user-avatar" />
                ) : (
                  <div
                    className={`user-avatar-fallback ${isCustomer ? "customer" : isVendor ? "vendor" : "admin"}`}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="user-name">{userName}</span>
                <span className="user-arrow">▼</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{userName}</div>
                    <div className="dropdown-user-role">
                      {isCustomer ? "Customer" : isVendor ? "Vendor" : "Admin"}
                    </div>
                  </div>

                  {!isAdmin && (
                    <NavLink
                      to={isCustomer ? "/customer/profile" : "/vendor/profile"}
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item"
                    >
                      <span className="dropdown-item-icon">👤</span>
                      Edit Profile
                    </NavLink>
                  )}

                  {!isAdmin && (
                    <NavLink
                      to={isCustomer ? "/customer/password" : "/vendor/password"}
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item"
                    >
                      <span className="dropdown-item-icon">🔒</span>
                      Change Password
                    </NavLink>
                  )}

                  <button onClick={handleLogout} className="dropdown-logout">
                    <span className="dropdown-item-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  }

  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return isLanding ? (
    <LandingPage />
  ) : (
    <>
      <NavBar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route
            path="/customer/login"
            element={
              customer ? (
                <Navigate to="/customer/home" replace />
              ) : (
                <CustomerLogin onLogin={handleCustomerLogin} />
              )
            }
          />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route
            path="/customer/home"
            element={
              customer ? (
                <CustomerHome
                  customer={customer}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/customer/login" replace />
              )
            }
          />
          <Route path="/customer/invoice" element={<CustomerInvoice />} />
          <Route
            path="/customer/profile"
            element={
              customer ? (
                <CustomerProfileEdit
                  customer={customer}
                  onUpdate={updateCustomer}
                  onBack={() => navigate("/customer/home")}
                />
              ) : (
                <Navigate to="/customer/login" replace />
              )
            }
          />
          <Route
            path="/customer/password"
            element={
              customer ? (
                <CustomerPasswordChange
                  customer={customer}
                  onBack={() => navigate("/customer/home")}
                />
              ) : (
                <Navigate to="/customer/login" replace />
              )
            }
          />

          <Route
            path="/vendor/login"
            element={
              vendor ? (
                <Navigate to="/vendor/home" replace />
              ) : (
                <VendorLogin onLogin={handleVendorLogin} />
              )
            }
          />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route
            path="/vendor/home"
            element={
              vendor ? (
                <VendorHome
                  vendor={vendor}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/vendor/login" replace />
              )
            }
          />
          <Route
            path="/vendor/products"
            element={
              vendor ? (
                <VendorProductMgt vendor={vendor} onBack={() => {}} />
              ) : (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                  <h2>Please log in as a vendor first</h2>
                  <a href="/vendor/login">Go to Vendor Login</a>
                </div>
              )
            }
          />
          <Route
            path="/vendor/profile"
            element={
              vendor ? (
                <VendorProfileEdit
                  vendor={vendor}
                  onUpdate={updateVendor}
                  onBack={() => navigate("/vendor/home")}
                />
              ) : (
                <Navigate to="/vendor/login" replace />
              )
            }
          />
          <Route
            path="/vendor/password"
            element={
              vendor ? (
                <VendorPasswordChange
                  vendor={vendor}
                  onBack={() => navigate("/vendor/home")}
                />
              ) : (
                <Navigate to="/vendor/login" replace />
              )
            }
          />

          <Route
            path="/admin/login"
            element={
              admin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              admin ? (
                <AdminDashboard admin={admin} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/customer/login" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
