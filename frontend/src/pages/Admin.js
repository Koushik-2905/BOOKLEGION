import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS

const API = "http://localhost:5000";

export default function Admin() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!admin || !admin.is_admin) return;
    if (!admin.password) {
      admin.password = "admin123";
      localStorage.setItem("user", JSON.stringify(admin));
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchUsers(),
      fetchMovies(),
      fetchGenres(),
      fetchBookings(),
    ]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${API}/users?admin_email=${admin.email}&admin_password=${admin.password}`
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API}/movies`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch(`${API}/genres`);
      const data = await res.json();
      setGenres(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      // Minimal placeholder: list of bookings not implemented in backend yet
      setBookings([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (url, refreshFn, successMsg) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const params = new URLSearchParams({
        admin_email: admin.email,
        admin_password: admin.password,
      }).toString();
      const res = await fetch(`${url}?${params}`, { method: "DELETE" });
      const data = await res.json();
      setStatusMessage(data.success ? successMsg : data.message);
      if (data.success && refreshFn) refreshFn();
    } catch (err) {
      console.error(err);
      setStatusMessage("Delete action failed");
    }
  };

  if (!admin || !admin.is_admin)
    return <div style={{ color: "red" }}>Not authorized</div>;
  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      {statusMessage && <div className="status-message">{statusMessage}</div>}

      {/* Users */}
      <h3>
        Users
        <button
          className="action-btn update-btn"
          style={{ marginLeft: 10 }}
          onClick={() =>
            navigate("/admin-form", { state: { type: "customer" } })
          }
        >
          Add New
        </button>
      </h3>
      {users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.is_admin ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="action-btn update-btn"
                    onClick={() =>
                      navigate("/admin-form", {
                        state: { type: "customer", data: u },
                      })
                    }
                  >
                    Update
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() =>
                      handleDelete(
                        `${API}/users/${u.user_id}`,
                        fetchUsers,
                        "User deleted successfully"
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Movies */}
      <h3>
        Movies
        <button
          className="action-btn update-btn"
          style={{ marginLeft: 10 }}
          onClick={() =>
            navigate("/admin-form", { state: { type: "product" } })
          }
        >
          Add New
        </button>
      </h3>
      {movies.length === 0 ? (
        <div>No movies found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.movie_id}>
                <td>{m.movie_id}</td>
                <td>{m.title}</td>
                <td>{m.genre || "-"}</td>
                <td>₹{m.price}</td>
                <td>{m.available_seats}</td>
                <td>
                  <button
                    className="action-btn update-btn"
                    onClick={() =>
                      navigate("/admin-form", {
                        state: { type: "product", data: m },
                      })
                    }
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Genres */}
      <h3>
        Genres
      </h3>
      {genres.length === 0 ? (
        <div>No genres found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((g) => (
              <tr key={g.genre_id}>
                <td>{g.genre_id}</td>
                <td>{g.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Bookings (summary placeholder) */}
      <h3>Bookings</h3>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="orders-grid">
          {bookings.map((b) => (
            <div key={b.booking_id} className="order-card">
              <h4>Booking ID: {b.booking_id}</h4>
              <p>
                <strong>User ID:</strong> {b.user_id}
              </p>
              <p>
                <strong>Date:</strong> {b.booking_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
