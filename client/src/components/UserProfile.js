import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../style/userprofile.css";
import Navbar_Login from "../components/Navbar_Login";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile() {
  axios.defaults.baseURL = REACT_APP_BACKEND_URL;
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [bookCounts, setBookCounts] = useState({
    read: 0,
    reading: 0,
    wantToRead: 0,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userDetails = await axios.get("/profile");
        setUser(userDetails.data);

        const books = await axios.get("/userbooks/get");
        const counts = { read: 0, reading: 0, wantToRead: 0 };

        books.data.forEach((b) => {
          if (b.status === "Read") counts.read += 1;
          else if (b.status === "Currently Reading") counts.reading += 1;
          else if (b.status === "Want to Read") counts.wantToRead += 1;
        });

        setBookCounts(counts);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile data");
      }
    };
    fetchDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <Navbar_Login />

      <motion.h1
        className="profile-greeting"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Hello, {user.name || "User"}!
      </motion.h1>

      <motion.div
        className="cards-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="profile-card">
          <h2>{bookCounts.read}</h2>
          <p>Books Read</p>
        </div>
        <div className="profile-card">
          <h2>{bookCounts.reading}</h2>
          <p>Currently Reading</p>
        </div>
        <div className="profile-card">
          <h2>{bookCounts.wantToRead}</h2>
          <p>Want to Read</p>
        </div>
      </motion.div>

      <motion.button
        className="logout-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
      >
        Logout
      </motion.button>

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
