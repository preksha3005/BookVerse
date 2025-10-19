import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar_Login from "../components/Navbar_Login";
import "../style/viewbook.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewBook() {
  axios.defaults.baseURL = "https://bookverse-backend-hcjw.onrender.com";
  axios.defaults.withCredentials = true;

  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = React.useState(null);
  const [userBookId, setUserBookId] = React.useState(null);
  const [status, setStatus] = React.useState("Want to Read");
  const [error, setError] = React.useState("");
  const [hasRecommended, setHasRecommended] = React.useState(false);
  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get logged-in user
        const userRes = await axios.get("/profile");
        setUserId(userRes.data._id);

        // 2. Get book details
        const bookRes = await axios.get(`/books/get/${bookId}`);
        setBook(bookRes.data);

        // 3. Get user's book entry
        const userBooksRes = await axios.get("/userbooks/get");
        const userBook = userBooksRes.data.find(
          (ub) => ub.bookId._id === bookId
        );
        if (userBook) {
          setUserBookId(userBook._id);
          setStatus(userBook.status);
        }

        // 4. Check if the user has already recommended the book
        const recRes = await axios.get(`/recommendations/check/${bookId}`);
        setHasRecommended(recRes.data.recommended);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch book or user data");
        toast.error("Failed to fetch book or user data");
      }
    };

    fetchData();
  }, [bookId]);
  const handleRecommend = async () => {
    if (!userBookId) return toast.error("Book not in your collection");
    try {
      const res = await axios.post("/recommendations/toggle", { bookId });
      toast.success(res.data.message);
      setHasRecommended(res.data.recommended); // updates button correctly
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to recommend book";
      toast.error(msg);
    }
  };

  // Update reading status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!userBookId) return toast.error("Book not in your collection");
    try {
      const res = await axios.put(`/userbooks/updatestatus/${userBookId}`, {
        status: newStatus,
      });
      setStatus(res.data.status);
      toast.success("Status updated!");
    } catch (err) {
      console.error(err);
      const msg = "Failed to update status";
      setError(msg);
      toast.error(msg);
    }
  };

  if (error) return <p className="error-msg">{error}</p>;
  if (!book) return <p className="loading-msg">Loading book details...</p>;

  return (
    <div className="bookdetails-container">
      <Navbar_Login />

      <motion.div
        className="bookdetails-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bookdetails-header">
          <img src={book.image} alt={book.title} className="book-cover" />
          <div className="book-info">
            <h2>{book.title}</h2>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>Genre:</strong> {book.genre}
            </p>

            <div className="status-update">
              <label>
                <strong>Status:</strong>
                <select value={status} onChange={handleStatusChange}>
                  <option value="Want to Read">Want to Read</option>
                  <option value="Currently Reading">Currently Reading</option>
                  <option value="Read">Read</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="book-description">
          <h3>Description</h3>
          <p>{book.description}</p>
        </div>

        <div className="book-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="recommend-btn"
            onClick={handleRecommend}
          >
            {hasRecommended ? "Unrecommend" : "Recommend"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="notes-btn"
            onClick={() =>
              navigate(`/booknotes/${userBookId}`, {
                state: { title: book.title },
              })
            }
          >
            Add/View Notes
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="back-btn"
          onClick={() => navigate("/homeuser")}
        >
          Back
        </motion.button>
      </motion.div>

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
