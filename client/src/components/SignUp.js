// src/pages/Signup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "../style/signup-login.css";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  axios.defaults.baseURL = "https://bookverse-backend-hcjw.onrender.com";
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("/sign", { name, email, password })
      .then((result) => {
        if (result.data.message) {
          toast.info(result.data.message);
        } else {
          toast.success("Signup successful!");
        }
        if (result.data.status) navigate("/login");
      })
      .catch((err) => {
        console.error("Error during sign-up:", err);
        if (err.response) {
          toast.error(err.response.data.message || "An error occurred.");
        } else if (err.request) {
          toast.error("No response from server. Check your network or server.");
        } else {
          toast.error("Request error. Please try again.");
        }
      });
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
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Sign Up
          </motion.button>
        </form>

        <p className="login-link">
          Already have an account?
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </motion.div>

      {/* Toast Container */}
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
