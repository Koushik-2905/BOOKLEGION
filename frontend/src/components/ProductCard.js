import React from "react";

export default function ProductCard({ p, onAdd }) {
  return (
    <div className="card">
      <div className="product-title">{p.title}</div>
      <div className="product-description">Genre: {p.genre || "—"}</div>
      <div className="product-price">₹{p.price}</div>
      <div className="product-description" style={{ marginBottom: '12px' }}>Seats: {p.available_seats}</div>
      <button className="btn btn-primary" onClick={() => onAdd(p.movie_id)} disabled={p.available_seats === 0}>
        {p.available_seats === 0 ? 'Sold Out' : 'Add to watchlist'}
      </button>
    </div>
  );
}


