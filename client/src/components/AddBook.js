import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../style/addbook.css";
import Navbar_Login from "../components/Navbar_Login";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddBook() {
  axios.defaults.baseURL = REACT_APP_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");
  const [books, setBooks] = React.useState([]);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageFile, setImageFile] = React.useState(null);
  const [status, setStatus] = React.useState("Want to Read");
  const [error, setError] = React.useState("");

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  React.useEffect(() => {
    if (search.trim().length === 0) {
      setBooks([]);
      setSelectedBook(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get("/books/get");
        const filtered = res.data.filter((b) =>
          b.title.toLowerCase().includes(search.toLowerCase())
        );
        setBooks(filtered);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching books.");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let bookId = selectedBook?._id;

    // 🟢 Case 1: Adding existing book
    if (selectedBook && bookId) {
      try {
        const res = await axios.post("/userbooks/add", { bookId, status });
        toast.success("Book added to your collection!");
        setTimeout(() => navigate("/homeuser"), 1500);
      } catch (err) {
        const msg = err.response?.data?.message || "Error adding book.";
        toast.error(msg);
        console.error("Add existing book error:", msg);
        setTimeout(() => navigate("/homeuser"), 1500);
      }
      return;
    }

    // 🆕 Case 2: Adding a completely new book
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", imageUrl);
    }

    try {
      const response = await axios.post("/books/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        bookId = response.data._id || response.data.book?._id;
        await axios.post("/userbooks/add", { bookId, status });
        toast.success("Book added to your collection!");
        setTimeout(() => navigate("/homeuser"), 1500);
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Error adding book. Please try again later.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="addbook-container">
      <Navbar_Login />

      <motion.div
        className="addbook-card"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Add a New Book</h2>

        {/* 🔍 Search Section */}
        <input
          type="text"
          placeholder="Search for a book..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🧭 Search Results */}
        {books.length > 0 && (
          <div className="search-results">
            {books.map((b) => (
              <div
                key={b._id}
                className={`book-card ${
                  selectedBook?._id === b._id ? "selected" : ""
                }`}
                onClick={() => setSelectedBook(b)}
              >
                <strong>{b.title}</strong> — {b.author}
              </div>
            ))}
          </div>
        )}

        {/* ✅ Selected Existing Book */}
        {selectedBook && (
          <div className="selected-book">
            <h3>{selectedBook.title}</h3>
            <p>{selectedBook.author}</p>
            <p>{selectedBook.genre}</p>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-dropdown"
            >
              <option>Want to Read</option>
              <option>Currently Reading</option>
              <option>Read</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="submit-btn"
            >
              Add to Collection
            </motion.button>
          </div>
        )}

        {/* 🆕 New Book Form */}
        {!selectedBook && (
          <form onSubmit={handleSubmit} className="addbook-form">
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            ></textarea>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-dropdown"
            >
              <option>Want to Read</option>
              <option>Currently Reading</option>
              <option>Read</option>
            </select>

            <input
              type="text"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {error && <p className="error-msg">{error}</p>}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="submit-btn"
            >
              Add To Collection
            </motion.button>
          </form>
        )}
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
