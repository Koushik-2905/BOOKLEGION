import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS
const API = "http://localhost:5000";

export default function Payment() {
  const loc = useLocation();
  const nav = useNavigate();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Get data from location state (passed from cart)
  const orderId = loc.state?.order_id || "";
  const amount = loc.state?.total_amount || 0;
  const cartItems = loc.state?.cart_items || [];

  const [method, setMethod] = useState("cash");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if no order data
  useEffect(() => {
    if (!orderId) {
      setStatusMessage("No order found. Please place an order first.");
      setTimeout(() => nav("/cart"), 2000);
    }
  }, [orderId, nav]);

  const pay = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login first");
      nav("/");
      return;
    }

    setLoading(true);
    try {
      // Make payment
      const res = await fetch(`${API}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          order_id: orderId, 
          amount, 
          method, 
          status: "success" 
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage("Payment successful! Redirecting to review...");

        // Delete watchlist items after successful payment
        for (const item of cartItems) {
          await fetch(`${API}/watchlist/${item.cart_id}`, { method: "DELETE" });
        }

        // Navigate to Review page and pass cart items for product ID
        setTimeout(() => {
          nav(`/review/${orderId}`, { 
            state: { 
              payment_success: true,
              amount,
              method,
              cart_items: cartItems
            }
          });
        }, 1500);
      } else {
        setStatusMessage(data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setStatusMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-container" style={{ maxWidth: 500, margin: "20px auto" }}>
        <h2 className="text-center">Payment</h2>

        {statusMessage && (
          <div className={`alert ${statusMessage.includes("successful") ? "alert-success" : "alert-error"}`}>
            {statusMessage}
          </div>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="cart-summary" style={{ marginBottom: "20px" }}>
            <h4>Order Summary</h4>
            {cartItems.map((item, index) => (
              <div key={index} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "4px 0",
                borderBottom: index < cartItems.length - 1 ? "1px solid #ddd" : "none"
              }}>
                <span>{item.name} (×{item.quantity})</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-total" style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #ddd" }}>
              Total: ₹{amount.toFixed(2)}
            </div>
          </div>
        )}

        <form onSubmit={pay}>
          <div className="form-group">
            <label className="form-label">Order ID</label>
            <input type="text" value={orderId} className="form-control" readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <input type="number" step="0.01" value={amount} className="form-control" readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="form-control">
              <option value="cash">Cash on Delivery</option>
              <option value="upi">UPI Payment</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large" 
            disabled={loading || amount <= 0}
            style={{ width: "100%" }}
          >
            {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button type="button" className="btn" onClick={() => nav("/cart")} disabled={loading}>
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
