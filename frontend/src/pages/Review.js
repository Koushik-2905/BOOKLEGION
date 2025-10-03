import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const API = "http://localhost:5000";

export default function Review() {
  const { orderId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const cartItems = location.state?.cart_items || [];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { setStatusMessage("Login required"); return; }
    if (cartItems.length === 0) { setStatusMessage("No movies to review."); return; }

    setLoading(true);
    try {
      for (let item of cartItems) {
        const res = await fetch(`${API}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: user.customer_id, product_id: item.movie_id, rating, comment })
        });
        const data = await res.json();
        if (!data.success) { setStatusMessage(data.message || "Failed to submit some reviews"); setLoading(false); return; }
      }
      setStatusMessage("Thanks for the review!");
      setTimeout(() => nav("/home"), 1500);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to submit review. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h2>Review (optional)</h2>
      <div className="mb-10">Order ID: {orderId}</div>
      {statusMessage && (<div className={`alert ${statusMessage.includes("Thanks") ? "alert-success" : "alert-error"}`} style={{ marginBottom: 15 }}>{statusMessage}</div>)}
      <form onSubmit={submit} className="form">
        <div className="form-group">
          <label className="form-label">Rating (1-5)</label>
          <input type="number" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} className="form-control" required />
        </div>
        <div className="form-group">
          <label className="form-label">Comment</label>
          <textarea placeholder="Write your comment here..." value={comment} onChange={e => setComment(e.target.value)} className="form-control" />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>{loading ? "Submitting..." : "Submit Review"}</button>
          <button type="button" className="btn btn-secondary btn-large" onClick={() => nav("/home")} disabled={loading}>Skip</button>
        </div>
      </form>
    </div>
  );
}


