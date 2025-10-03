import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

const API = "http://localhost:5000";

export default function AdminForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, data } = location.state || {};
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState(data || {
    name: "",
    email: "",
    password: "",
    is_admin: 0,
    title: "",
    price: 0,
    available_seats: 0,
    genre_id: null,
    description: "",
    duration: 0,
    showtime: ""
  });
  const [genres, setGenres] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (type === "product") {
      fetch(`${API}/genres`).then(r => r.json()).then(setGenres).catch(console.error);
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const typeMap = { customer: "users", product: "movies" };
      const idKey = type === "customer" ? "user_id" : "movie_id";
      let url = `${API}/${typeMap[type]}`;
      let method = "POST";
      if (data && data[idKey]) { url += `/${data[idKey]}`; method = "PUT"; }

      const payload = type === "customer" ? {
        name: form.name,
        email: form.email,
        password: form.password,
        is_admin: form.is_admin,
        admin_email: admin.email,
        admin_password: admin.password
      } : {
        title: form.title || form.name,
        price: form.price,
        available_seats: form.available_seats,
        genre_id: form.genre_id,
        description: form.description,
        duration: form.duration,
        showtime: form.showtime,
        admin_email: admin.email,
        admin_password: admin.password
      };

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await res.json();
      setStatusMessage(result.success ? `${type} saved successfully` : result.message);
      if (result.success) navigate("/admin");
    } catch (err) {
      console.error(err);
      setStatusMessage("Action failed. Check backend.");
    }
  };

  if (!admin || !admin.is_admin) return <div style={{ color: "red" }}>Not authorized</div>;

  return (
    <div className="container page-container">
      <h2>{data ? `Update ${type}` : `Add New ${type}`}</h2>
      {statusMessage && <div className={`alert ${statusMessage.includes("successfully") ? "alert-success" : "alert-error"}`}>{statusMessage}</div>}

      <form onSubmit={handleSubmit} className="form-group">
        {type === "customer" && (
          <>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-control" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" value={form.password || ""} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Admin</label>
              <select className="form-control" value={form.is_admin} onChange={e => setForm({ ...form, is_admin: Number(e.target.value) })}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </>
        )}

        {type === "product" && (
          <>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-control" type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input className="form-control" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Available Seats</label>
              <input className="form-control" type="number" value={form.available_seats} onChange={e => setForm({ ...form, available_seats: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-control" value={form.genre_id || ""} onChange={e => setForm({ ...form, genre_id: Number(e.target.value) })} required>
                <option value="">Select Genre</option>
                {genres.map(g => <option key={g.genre_id} value={g.genre_id}>{g.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-control" type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (mins)</label>
              <input className="form-control" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Showtime (YYYY-MM-DD HH:MM:SS)</label>
              <input className="form-control" type="text" value={form.showtime} onChange={e => setForm({ ...form, showtime: e.target.value })} />
            </div>
          </>
        )}

        <button type="submit" className="action-btn update-btn">{data ? "Update" : "Save"}</button>
        <button type="button" className="action-btn delete-btn" onClick={() => navigate("/admin")}>Cancel</button>
      </form>
    </div>
  );
}


