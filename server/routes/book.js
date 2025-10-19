import express from "express";
import Book from "../models/Book.js";
import multer from "multer";
import { verifyuser } from "../middleware/auth.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recipes",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

router.post("/add", verifyuser, upload.single("image"), async (req, res) => {
  try {
    const { title, author, genre, image, description } = req.body;

    const existing = await Book.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
    });
    if (existing) return res.status(200).json(existing);

    const finalCoverUrl = req.file ? req.file.path : image; // upload overrides URL

    const newBook = new Book({
      title,
      author,
      genre,
      image: finalCoverUrl,
      description,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const books = await Book.find();
    return res.json(books);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/get/:bookId", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
