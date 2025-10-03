import React from "react";

export default function ProductCard({ p, onAdd }) {
  const { title, price, description, duration, showtime, genre, movie_id } = p;
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {genre && <div className="badge">{genre}</div>}
        <p className="card-text">{description}</p>
        <div className="meta">
          {duration ? <span>Duration: {duration} min</span> : null}
          {showtime ? <span>Showtime: {new Date(showtime).toLocaleString()}</span> : null}
        </div>
        <div className="card-footer">
          <strong>₹{Number(price).toFixed(2)}</strong>
          <button className="btn" onClick={() => onAdd(movie_id)}>Add to Watchlist</button>
        </div>
      </div>
    </div>
  );
}


