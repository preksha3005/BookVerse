import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../style/publicnotes.css";
import Navbar_Login from "../components/Navbar_Login";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicNotes() {
  axios.defaults.baseURL = "https://bookverse-backend-hcjw.onrender.com";
  axios.defaults.withCredentials = true;
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/userbooks/public");
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
        toast.error("Failed to fetch shared notes");
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="publicnotes-container">
      <Navbar_Login />

      <motion.h1
        className="publicnotes-heading"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌍 Shared Notes Library
      </motion.h1>

      <div className="notes-grid">
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <motion.div
              key={index}
              className="note-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <h2 className="book-title">{note.bookTitle}</h2>
              <p className="book-author">by {note.bookAuthor}</p>
              <p className="note-content">“{note.content}”</p>
              <div className="note-footer">
                <span className="note-user">👤 {note.userName}</span>
                <span className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="no-notes">No shared notes yet 📝</p>
        )}
      </div>

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
