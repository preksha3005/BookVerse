import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar_Login from "../components/Navbar_Login";
import { motion } from "framer-motion";
import "../style/booknotes.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookNotes() {
  axios.defaults.baseURL = "https://bookverse-backend-hcjw.onrender.com";
  axios.defaults.withCredentials = true;

  const { userBookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const bookTitle = location.state?.title || "Book Notes";

  const [notes, setNotes] = React.useState([]);
  const [newNote, setNewNote] = React.useState("");
  const [shared, setShared] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`/userbooks/${userBookId}/getnotes`);
        setNotes(res.data.notes);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch notes");
        setLoading(false);
      }
    };
    fetchNotes();
  }, [userBookId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return toast.info("Please write a note first");
    try {
      const res = await axios.post(`/userbooks/${userBookId}/addnote`, {
        content: newNote,
        shared,
      });
      setNotes(res.data.notes);
      setNewNote("");
      setShared(false);
      toast.success("Note added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await axios.delete(
        `/userbooks/${userBookId}/deletenote/${noteId}`
      );
      setNotes(res.data.userBook.notes);
      toast.success("Note deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    }
  };

  const handleEditNote = async (noteId, currentContent, currentShared) => {
    const updatedContent = prompt("Edit note:", currentContent);
    if (updatedContent === null) return;
    const updatedShared = window.confirm("Share this note publicly?");
    try {
      const res = await axios.put(
        `/userbooks/${userBookId}/editnote/${noteId}`,
        { content: updatedContent, shared: updatedShared }
      );
      setNotes(res.data.notes);
      toast.success("Note updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update note");
    }
  };

  if (loading) return <p className="loading-msg">Loading notes...</p>;

  return (
    <motion.div
      className="bookdetails-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Navbar_Login />

      <motion.div
        className="bookdetails-card"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2>{bookTitle} - Notes</h2>

        {/* Add Note Section */}
        <div className="add-note">
          <input
            type="text"
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={shared}
              onChange={(e) => setShared(e.target.checked)}
            />
            Share
          </label>

          <motion.button
            onClick={handleAddNote}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Note
          </motion.button>
        </div>

        {/* Notes List */}
        <ul className="notes-list">
          {notes.map((note, index) => (
            <motion.li
              key={note._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span>{note.content}</span>
              {note.shared && (
                <span style={{ color: "#00ffb3", marginLeft: "10px" }}>
                  Shared
                </span>
              )}
              <div className="note-actions">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    handleEditNote(note._id, note.content, note.shared)
                  }
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteNote(note._id)}
                >
                  Delete
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Back Button */}
        <motion.button
          className="back-btn"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
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
    </motion.div>
  );
}
