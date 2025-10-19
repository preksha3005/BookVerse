import React from "react";
import NavbarLogin from "./Navbar_Login";
import "../style/homeuser.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeUser() {
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const [userbooks, setUserBooks] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .get("/userbooks/get")
      .then((res) => setUserBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const sections = [
    { title: "Want to Read", status: "want to read" },
    { title: "Currently Reading", status: "currently reading" },
    { title: "Read", status: "read" },
  ];

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const searchedBooks =
    searchTerm.trim() === ""
      ? []
      : userbooks.filter(
          (ub) =>
            ub.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ub.bookId.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ub.bookId.genre?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="homeuser-container">
      <NavbarLogin />

      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search your books by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="homeuser-content">
        {/* ✅ Show search results if any */}
        {searchTerm.trim() !== "" && (
          <div className="book-section">
            <h2>Search Results</h2>
            <div className="book-scroll">
              {searchedBooks.length > 0 ? (
                searchedBooks.map((ub) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={ub._id}
                    className="book-card"
                    onClick={() => handleBookClick(ub.bookId._id)}
                  >
                    <img
                      src={ub.bookId.image || "/default-book.png"}
                      alt={ub.bookId.title}
                    />
                    <div className="book-info">
                      <h3>{ub.bookId.title}</h3>
                      <p>{ub.bookId.author}</p>
                      <span>{ub.bookId.genre}</span>
                      <p className="book-status">
                        <strong>Status:</strong> {ub.status}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="no-books">No matching books found</p>
              )}
            </div>
          </div>
        )}

        {/* 📚 Default section view */}
        {sections.map((section) => {
          const filteredBooks = userbooks.filter(
            (ub) => ub.status.toLowerCase() === section.status
          );
          return (
            <div key={section.title} className="book-section">
              <h2>{section.title}</h2>
              <div className="book-scroll">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((ub) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={ub._id}
                      className="book-card"
                      onClick={() => handleBookClick(ub.bookId._id)}
                    >
                      <img
                        src={ub.bookId.image || "/default-book.png"}
                        alt={ub.bookId.title}
                      />
                      <div className="book-info">
                        <h3>{ub.bookId.title}</h3>
                        <p>{ub.bookId.author}</p>
                        <span>{ub.bookId.genre}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="no-books">No books in this section</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
