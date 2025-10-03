import React from "react";
import "../App.css";

export default function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <div>Price: ₹{item.price}</div>
        <div>Seats: {item.quantity}</div>
      </div>
      <button className="action-btn delete-btn" onClick={() => onRemove(item.cart_id)}>
        Remove
      </button>
    </div>
  );
}


