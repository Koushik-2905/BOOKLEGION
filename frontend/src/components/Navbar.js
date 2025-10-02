import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "../App.css"; // Import CSS

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && !user.is_admin && <Link to="/home" className="nav-link">Home</Link>}
        {user && !user.is_admin && <Link to="/cart" className="nav-link">Cart</Link>}
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
            <Link to="/" className="nav-link">Login</Link> | <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
