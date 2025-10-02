import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS

const API = "http://localhost:5000";

export default function AdminForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, data, productId } = location.state || {};
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState(
    data || {
      name: "",
      email: "",
      password: "",
      is_admin: 0,
      price: 0,
      stock: 0,
      category_id: null,
      title: "",
      available_seats: 0,
      genre_id: null,
      description: "",
      duration: 0,
      showtime: "",
    }
  );

  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch genres for movies
  useEffect(() => {
    if (type === "product") {
      fetch(`${API}/genres`)
        .then((res) => res.json())
        .then(setGenres)
        .catch(console.error);
    }
  }, [type]);

  // Fetch reviews if viewing movie reviews
  useEffect(() => {
    if (type === "reviews" && productId) {
      fetch(`${API}/reviews/${productId}`)
        .then((res) => res.json())
        .then((data) => setReviews(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [type, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map: customer->users, product->movies, category->genres
      const typeMap = { customer: "users", product: "movies", category: "genres" };
      let url = `${API}/${typeMap[type]}`;
      let method = "POST";

      const idKeyMap = { customer: "user_id", product: "movie_id", category: "genre_id" };
      const idKey = idKeyMap[type];
      if (data && data[idKey]) {
        url += `/${data[idKey]}`;
        method = "PUT";
      }

      // Build payload per type
      let payload = { admin_email: admin.email, admin_password: admin.password };
      if (type === "customer") {
        payload = { ...payload, name: form.name, email: form.email, password: form.password, is_admin: form.is_admin };
      } else if (type === "product") {
        payload = {
          ...payload,
          title: form.title || form.name,
          price: form.price,
          available_seats: form.available_seats || form.stock,
          genre_id: form.genre_id || form.category_id,
          description: form.description,
          duration: form.duration,
          showtime: form.showtime,
        };
      } else if (type === "category") {
        // No admin-protected endpoints implemented for genres add/update; keep placeholder
        payload = { name: form.name };
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setStatusMessage(result.success ? `${type} saved successfully` : result.message);

      if (result.success) navigate("/admin");
    } catch (err) {
      console.error(err);
      setStatusMessage("Action failed. Check backend.");
    }
  };

  if (!admin || !admin.is_admin)
    return <div style={{ color: "red" }}>Not authorized</div>;

  return (
    <div className="container page-container">
      {type === "reviews" && (
        <>
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.review_id} className="review-card">
                <p><strong>{r.name}</strong> – Rating: {r.rating}</p>
                <p>{r.comment}</p>
              </div>
            ))
          )}
          <button
            className="action-btn delete-btn"
            style={{ marginTop: 10 }}
            onClick={() => navigate("/admin")}
          >
            Back to Admin
          </button>
        </>
      )}

      {type !== "reviews" && (
        <>
          <h2>{data ? `Update ${type}` : `Add New ${type}`}</h2>

          {statusMessage && (
            <div
              className={`alert ${
                statusMessage.includes("successfully") ? "alert-success" : "alert-error"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-group">
            {(type === "customer" || type === "category") && (
              <div className="form-group">
                <label className="form-label">Name:</label>
                <input
                  className="form-control"
                  type="text"
                  value={form.name || form.title}
                  onChange={(e) => setForm({ ...form, name: e.target.value, title: e.target.value })}
                  required
                />
              </div>
            )}

            {type === "customer" && (
              <>
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    className="form-control"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password:</label>
                  <input
                    className="form-control"
                    type="password"
                    value={form.password || ""}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Admin:</label>
                  <select
                    className="form-control"
                    value={form.is_admin}
                    onChange={(e) => setForm({ ...form, is_admin: Number(e.target.value) })}
                  >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </>
            )}

            {type === "product" && (
              <>
                <div className="form-group">
                  <label className="form-label">Price:</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Seats:</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.available_seats}
                    onChange={(e) => setForm({ ...form, available_seats: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Genre:</label>
                  <select
                    className="form-control"
                    value={form.genre_id || ""}
                    onChange={(e) => setForm({ ...form, genre_id: Number(e.target.value) })}
                    required
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g.genre_id} value={g.genre_id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (mins):</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Showtime (YYYY-MM-DD HH:MM:SS):</label>
                  <input
                    className="form-control"
                    type="text"
                    value={form.showtime}
                    onChange={(e) => setForm({ ...form, showtime: e.target.value })}
                  />
                </div>
              </>
            )}

            {type !== "reviews" && (
              <>
                <button type="submit" className="action-btn update-btn">
                  {data ? "Update" : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </button>
                <button
                  type="button"
                  className="action-btn delete-btn"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </button>
              </>
            )}
          </form>
        </>
      )}
    </div>
  );
}
