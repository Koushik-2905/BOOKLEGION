import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { api } from "../api/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  const fetchMovies = async (genre_id) => {
    try {
      const data = await api.getMovies({ genre_id });
      setMovies(data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch movies." });
    }
  };

  const fetchGenres = async () => {
    try {
      const data = await api.getGenres();
      setGenres(data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch genres." });
    }
  };

  const addToCart = async (movie_id) => {
    if (!user) { setMessage({ type: "error", text: "Please login first" }); return; }
    try {
      const res = await api.addToWatchlist({ user_id: user.customer_id, movie_id, seats_selected: 1 });
      setMessage(res.success ? { type: "success", text: "Added to watchlist" } : { type: "error", text: res.message || "Error adding" });
    } catch (e) {
      setMessage({ type: "error", text: e.message || "Failed" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="container">
      <h2>Movies</h2>
      {message && (<div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>{message.text}</div>)}

      <div className="form-group">
        <label htmlFor="categoryFilter">Filter by Genre:</label>
        <select id="categoryFilter" className="form-control" value={filter} onChange={e => { setFilter(e.target.value); fetchMovies(e.target.value); }}>
          <option value="">All Genres</option>
          {genres.map(g => (<option key={g.genre_id} value={g.genre_id}>{g.name}</option>))}
        </select>
      </div>

      <div className="cards-grid">
        {movies.map(m => (<ProductCard key={m.movie_id} p={m} onAdd={addToCart} />))}
      </div>
    </div>
  );
}


