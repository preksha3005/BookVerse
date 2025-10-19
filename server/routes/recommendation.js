import express from "express";
import { verifyuser } from "../middleware/auth.js";
import Recommendation from "../models/Recommendation.js";
import Book from "../models/Book.js";
const router = express.Router();

router.post("/toggle", verifyuser, async (req, res) => {
  try {
    const { bookId } = req.body;
    const existing = await Recommendation.findOne({
      userId: req.user.id,
      bookId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({
        message: "Recommendation removed",
        recommended: false,
      });
    }

    await Recommendation.create({
      userId: req.user.id,
      bookId,
    });
    res.json({ message: "Book recommended!", recommended: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/check/:bookId", verifyuser, async (req, res) => {
  try {
    const { bookId } = req.params;
    const existing = await Recommendation.findOne({
      userId: req.user.id,
      bookId,
    });
    res.json({ recommended: !!existing }); // true if exists, false otherwise
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .populate("userId", "name")
      .populate("bookId", "title author genre image");

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/like/:id", verifyuser, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }
    const userId = req.user.id.toString();
    const index = recommendation.likes.findIndex(
      (id) => id.toString() === userId
    );
    if (index === -1) {
      recommendation.likes.push(userId);
      await recommendation.save();
      return res.json({
        message: "Liked",
        likesCount: recommendation.likes.length,
      });
    } else {
      recommendation.likes.splice(index, 1);
      await recommendation.save();
      return res.json({
        message: "Unliked",
        likesCount: recommendation.likes.length,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
