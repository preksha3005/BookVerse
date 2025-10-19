import React from "react";
import "../style/navbar-home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.header
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <h1 className="logo">
        <Link to="/" className="nav-link">
          📖🪄 BookVerse
        </Link>
      </h1>
      <nav>
        <Link to="/sign" className="btn">
          Sign Up
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </nav>
    </motion.header>
  );
};

export default Navbar;
