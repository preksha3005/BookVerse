import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js";
import userBookRoutes from "./routes/userBook.js";
import recommendationRoutes from "./routes/recommendation.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/", userRoutes); // /register, /login
app.use("/books", bookRoutes); // /books/add, /books/
app.use("/userbooks", userBookRoutes); // /userbooks, /userbooks/:id/notes
app.use("/recommendations", recommendationRoutes); // /recommendations

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
