import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-link">Home</Link>
        {user && !user.is_admin && <Link to="/watchlist" className="nav-link">Watchlist</Link>}
        {user && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
        {user && user.is_admin && <Link to="/admin" className="nav-link">Admin</Link>}
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="nav-greet">Hi, {user.name}</span>
            <button className="action-btn delete-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            {" "}|{" "}
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}


