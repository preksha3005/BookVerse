import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar_Login from "../components/Navbar_Login";
import { useNavigate } from "react-router-dom";
import "../style/recommendations.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Recommendations() {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/recommendations/get"); // backend endpoint
        setRecommendations(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        toast.error("Failed to fetch recommendations");
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="recommendations-container">
      <Navbar_Login />

      <motion.h1
        className="recommendations-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Recommended Books
      </motion.h1>

      {loading ? (
        <motion.p
          className="message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Loading recommendations...
        </motion.p>
      ) : recommendations.length === 0 ? (
        <motion.p
          className="message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          No recommendations yet.
        </motion.p>
      ) : (
        <motion.div
          className="recommendations-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {recommendations.map((rec) => (
            <motion.div
              className="recommendation-card"
              key={rec._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBookClick(rec.bookId._id)}
            >
              {rec.bookId?.image && (
                <img src={rec.bookId.image} alt={rec.bookId.title} />
              )}
              <div className="book-info">
                <h3>{rec.bookId?.title}</h3>
                <p>
                  <strong>Author:</strong> {rec.bookId?.author}
                </p>
                <p>
                  <strong>Genre:</strong> {rec.bookId?.genre || "Unknown"}
                </p>
                <p>
                  <strong>Recommended by:</strong>{" "}
                  {rec.userId?.name || "Anonymous"}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

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
