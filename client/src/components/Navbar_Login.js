// src/components/NavbarUser.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/navbar-login.css";
import { motion } from "framer-motion";

export default function Navbar_Login() {
  const navigate = useNavigate();

  return (
    <motion.header
      className="navbar-user"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="nav-left">
        <h1 className="logo" onClick={() => navigate("/homeuser")}>
          📖🪄 <span className="logo-text">BookVerse</span>
        </h1>
      </div>

      <nav className="nav-links">
        <Link to="/addbook" className="nav-link">
          Add Book
        </Link>
        <Link to="/recommendations" className="nav-link">
          Recommended
        </Link>
        <Link to="/publicnotes" className="nav-link">
          Notes
        </Link>
        <div className="profile-icon" onClick={() => navigate("/profile")}>
          👤
        </div>
      </nav>
    </motion.header>
  );
}
