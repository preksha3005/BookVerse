// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../style/home.css";
import bookbg2 from "../assets/bookbg2.jpg";

export default function Home(){
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />

      <motion.div
        className="home-content-wrapper"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="home-text"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="home-title">Welcome to BookVerse</h1>
          <p className="home-description">
            Track your reading journey, share personal notes, and discover
            recommendations from readers worldwide. Your library, your universe.
          </p>

          <div className="home-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/sign")}
              className="signup-btn"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="login-btn"
            >
              Login
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="home-image"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <img src={bookbg2} alt="Books Illustration" />
        </motion.div>
      </motion.div>
    </div>
  );
};

