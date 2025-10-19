import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Book", BookSchema);
