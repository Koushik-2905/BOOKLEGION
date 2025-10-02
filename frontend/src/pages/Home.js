import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../App.css"; // Import CSS
const API = "http://localhost:5000";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null); // <-- New state for messages
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  const fetchMovies = async (genre_id) => {
    try {
      let url = API + "/movies";
      if (genre_id) url += "?genre_id=" + genre_id;
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setMessage({ type: "error", text: "Failed to fetch movies. Check backend." });
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch(API + "/genres");
      const data = await res.json();
      setGenres(data);
    } catch (err) {
      console.error("Failed to fetch genres:", err);
      setMessage({ type: "error", text: "Failed to fetch genres. Check backend." });
    }
  };

  const addToCart = async (movie_id) => {
    if (!user) { 
      setMessage({ type: "error", text: "Please login first" });
      return; 
    }
    try {
      const res = await fetch(API + "/watchlist/", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customer_id: user.customer_id, 
          product_id: movie_id, 
          quantity: 1 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Added to cart" });
      } else {
        setMessage({ type: "error", text: data.message || "Error adding to cart" });
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      setMessage({ type: "error", text: "Failed to fetch. Check backend or network." });
    }

    // Hide message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="container">
      <h2>Movies</h2>

      {/* Message Box */}
      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="categoryFilter">Filter by Genre:</label>
        <select
          id="categoryFilter"
          className="form-control"
          value={filter}
          onChange={e => { 
            setFilter(e.target.value); 
            fetchMovies(e.target.value); 
          }}
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.genre_id} value={g.genre_id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="cards-grid">
        {movies.map(p => (
          <ProductCard key={p.movie_id} p={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  );
}
