import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import "../App.css"; // Import CSS
const API = "http://localhost:5000";

export default function Cart() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch(API + "/watchlist/" + user.customer_id);
    const data = await res.json();
    setItems(data);
  };

  const remove = async (cart_id) => {
    const res = await fetch(API + "/watchlist/" + cart_id, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchCart();
    else alert(data.message || "Error");
  };

  const checkout = async () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

    const res = await fetch(API + "/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: user.customer_id }),
    });
    const data = await res.json();
    if (data.success) {
      // Pass order ID, cart items, and total amount to Payment page
      nav("/payment", { state: { order_id: data.order_id, cart_items: items, total_amount: total } });
    } else {
      alert(data.message || "Checkout failed");
    }
  };

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="container page-container">
      <h2>Your Watchlist</h2>

      {items.length === 0 && <div>Cart is empty</div>}

      {items.map((it) => (
        <CartItem key={it.cart_id} item={it} onRemove={remove} />
      ))}

      {items.length > 0 && (
        <div className="cart-summary">
          <div className="cart-total">Total: ₹{total.toFixed(2)}</div>
          <button className="action-btn update-btn" onClick={checkout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
