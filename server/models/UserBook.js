import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  shared: { type: Boolean, default: false },
});

const UserBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: {
    type: String,
    enum: ["Read", "Currently Reading", "Want to Read"],
    default: "Want to Read",
  },
  notes: [NoteSchema],
});

export default mongoose.model("UserBook", UserBookSchema);
