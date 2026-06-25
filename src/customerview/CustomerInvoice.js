import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerInvoice.css";

const API = process.env.REACT_APP_BASE_API_URL || "http://localhost:9191";
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || "your_razorpay_key_id";

function CustomerInvoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, customer } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!product || !customer) {
    return (
      <div className="invoice-container">
        <div className="invoice-card" style={{ textAlign: "center" }}>
          <h2>No product or customer data</h2>
          <button
            onClick={() => navigate("/customer/products")}
            className="invoice-secondary-btn"
            style={{ marginTop: 16 }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = Number(product.opprice) * quantity;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        CId: customer.CId,
        CustomerName: customer.CustomerName,
        CContact: customer.CContact,
        CEmail: customer.CEmail,
        CAddress: customer.CAddress,
        pid: product.pid,
        pname: product.pname,
        opprice: product.opprice,
        quantity
      };

      const res = await axios.post(`${API}/invoice/create`, payload);
      setInvoice(res.data.invoice);
      setSubmitted(true);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const orderRes = await axios.post(`${API}/invoice/create-razorpay-order`, {
        invoiceId: invoice.invoiceId,
      });

      const { orderId, amount, currency } = orderRes.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Marketplace",
        description: `Invoice #${invoice.invoiceId}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.post(`${API}/invoice/verify-payment`, {
              invoiceId: invoice.invoiceId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPaymentDone(true);
          } catch (err) {
            alert("Payment verification failed: " + (err.response?.data?.error || err.message));
          }
        },
        prefill: {
          name: customer.CustomerName,
          email: customer.CEmail,
          contact: customer.CContact,
        },
        theme: { color: "#FF9900" },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      alert("Failed to initiate payment: " + (err.response?.data?.error || err.message));
      setPaymentLoading(false);
    }
  };

  if (submitted && invoice) {
    return (
      <div className="invoice-container">
        <div className="invoice-card">
          {paymentDone ? (
            <h2 className="invoice-success">Payment Successful!</h2>
          ) : (
            <h2>Invoice Generated</h2>
          )}
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            {paymentDone
              ? "Your invoice has been paid. A copy has been sent to your email."
              : ""}
          </p>
          <hr className="invoice-divider" />
          <p><strong>Invoice ID:</strong> #{invoice.invoiceId}</p>
          <p><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          <hr className="invoice-divider" />
          <h4>Customer Details</h4>
          <p><strong>Name:</strong> {invoice.CustomerName}</p>
          <p><strong>Contact:</strong> {invoice.CContact || "N/A"}</p>
          <p><strong>Email:</strong> {invoice.CEmail || "N/A"}</p>
          <p><strong>Address:</strong> {invoice.CAddress || "N/A"}</p>
          <hr className="invoice-divider" />
          <h4>Product Details</h4>
          <p><strong>Product:</strong> {invoice.pname}</p>
          <p><strong>Unit Price:</strong> ₹{invoice.opprice}</p>
          <p><strong>Quantity:</strong> {invoice.quantity}</p>
          <p className="invoice-total">Total Amount: ₹{invoice.totalAmount}</p>
          <p><strong>Status:</strong> {paymentDone ? "Paid" : invoice.status}</p>
          {!paymentDone ? (
            <div className="invoice-actions">
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="invoice-pay-btn"
              >
                {paymentLoading ? "Processing..." : "Pay Now with Razorpay"}
              </button>
              <button
                onClick={() => navigate("/customer/products")}
                className="invoice-secondary-btn"
              >
                Pay Later
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/customer/products")}
              className="invoice-pay-btn"
              style={{ marginTop: 20 }}
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-container">
      <div className="invoice-card">
        <h2>Customer Invoice</h2>
        <hr className="invoice-divider" />

        <h4>Customer Details</h4>
        <p><strong>Name:</strong> {customer.CustomerName}</p>
        <p><strong>Customer ID:</strong> {customer.CId}</p>
        <p><strong>Contact:</strong> {customer.CContact || "N/A"}</p>
        <p><strong>Email:</strong> {customer.CEmail || "N/A"}</p>
        <p><strong>Address:</strong> {customer.CAddress || "N/A"}</p>

        <hr className="invoice-divider" />

        <h4>Product Details</h4>
        <p><strong>Product:</strong> {product.pname}</p>
        <p><strong>Price:</strong> ₹{product.opprice}</p>

        <div style={{ margin: "16px 0" }}>
          <label className="invoice-qty-label">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="invoice-qty-input"
          />
        </div>

        <p className="invoice-total">Total Amount: ₹{totalAmount}</p>

        <div className="invoice-btn-row">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="invoice-pay-btn"
          >
            {loading ? "Processing..." : "Confirm & Generate Invoice"}
          </button>
          <button
            onClick={() => navigate("/customer/products")}
            className="invoice-secondary-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerInvoice;
