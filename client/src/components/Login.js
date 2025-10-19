// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../style/signup-login.css";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  axios.defaults.baseURL = REACT_APP_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("/login", { email, password })
      .then((result) => {
        if (result.data.status) {
          toast.success(result.data.message || "Login successful! 🚀");
          setTimeout(() => navigate("/homeuser"), 1500);
        } else {
          toast.error(result.data.message || "Invalid credentials, try again.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else if (err.response) {
          toast.error(`Server error: ${err.response.status}`);
        } else {
          toast.error("Network error. Please check your connection.");
        }
      });

    setEmail("");
    setPassword("");
  };

  return (
    <div className="signup-container">
      <Navbar />

      <motion.div
        className="signup-card"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Login to Your Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="signup-btn"
          >
            Login
          </motion.button>
        </form>

        <p className="login-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/sign")}>Sign Up</span>
        </p>
      </motion.div>

      {/* 🌌 Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </div>
  );
}
