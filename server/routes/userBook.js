import express from "express";
import { verifyuser } from "../middleware/auth.js";
import UserBook from "../models/UserBook.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/add", verifyuser, async (req, res) => {
  const { bookId, status } = req.body;
  const userId = req.user.id;
  try {
    let existing = await UserBook.findOne({ userId, bookId });
    if (existing) {
      return res.status(400).json({ message: "Book already exists" });
    }
    const userBook = await new UserBook({ userId, bookId, status });
    await userBook.save();
    res.json(userBook);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/get", verifyuser, async (req, res) => {
  const userId = req.user.id;
  try {
    const userBooks = await UserBook.find({ userId }).populate("bookId");
    res.json(userBooks);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/:userBookId/addnote", verifyuser, async (req, res) => {
  const { content, shared } = req.body;
  const userId = req.user.id;
  try {
    const userBook = await UserBook.findOne({
      _id: req.params.userBookId,
      userId: userId,
    });
    if (!userBook) {
      res.status(404).json({ message: "Book not found" });
    }
    userBook.notes.push({ content, shared });
    await userBook.save();
    res.json(userBook);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:userBookId/getnotes", verifyuser, async (req, res) => {
  const userId = req.user.id;
  const { userBookId } = req.params;

  try {
    const userBook = await UserBook.findOne({ _id: userBookId, userId });

    if (!userBook) {
      return res.status(404).json({ message: "UserBook not found" });
    }

    // Return notes only
    res.json({ notes: userBook.notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.put("/:userBookId/editnote/:noteId", verifyuser, async (req, res) => {
  const { content, shared } = req.body;
  const userId = req.user.id;
  try {
    const userBook = await UserBook.findOne({
      _id: req.params.userBookId,
      userId: userId,
    });
    if (!userBook) return res.status(404).json({ msg: "UserBook not found" });

    const note = userBook.notes.id(req.params.noteId);
    if (!note) return res.status(404).json({ msg: "Note not found" });

    note.content = content;
    note.shared = shared;
    await userBook.save();
    res.json(userBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(
  "/:userBookId/deletenote/:noteId",
  verifyuser,
  async (req, res) => {
    const userId = req.user.id;
    try {
      const userBook = await UserBook.findOne({
        _id: req.params.userBookId,
        userId,
      });
      if (!userBook)
        return res.status(404).json({ message: "UserBook not found" });

      const note = userBook.notes.id(req.params.noteId);
      if (!note) return res.status(404).json({ message: "Note not found" });

      note.deleteOne();
      await userBook.save();

      res.json({ message: "Note deleted successfully", userBook });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting note." });
    }
  }
);

router.get("/public", async (req, res) => {
  try {
    // Fetch all user books that have notes with shared = true
    const userBooks = await UserBook.find({ "notes.shared": true })
      .populate("bookId", "title author")
      .populate("userId", "name");

    // Extract and flatten shared notes
    const sharedNotes = [];
    userBooks.forEach((ub) => {
      ub.notes.forEach((note) => {
        if (note.shared) {
          sharedNotes.push({
            content: note.content,
            createdAt: note.createdAt,
            bookTitle: ub.bookId?.title || "Untitled",
            bookAuthor: ub.bookId?.author || "Unknown",
            userName: ub.userId?.name || "Anonymous",
          });
        }
      });
    });
    res.json(sharedNotes);
  } catch (err) {
    console.error("Error fetching public notes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/updatestatus/:userBookId", verifyuser, async (req, res) => {
  const { userBookId } = req.params;
  const { status } = req.body;
  const validStatuses = ["Read", "Currently Reading", "Want to Read"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const userBook = await UserBook.findOne({
      _id: userBookId,
      userId: req.user.id,
    });

    if (!userBook) return res.status(404).json({ message: "Book not found" });

    userBook.status = status;
    await userBook.save();

    res.json({ message: "Status updated", status: userBook.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
