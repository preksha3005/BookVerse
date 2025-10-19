import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import HomeUser from "./components/HomeUser.js";
import AddBook from "./components/AddBook.js";
import UserProfile from "./components/UserProfile.js";
import ViewBook from "./components/ViewBook.js";
import BookNotes from "./components/BookNotes.js";
import PublicNotes from "./components/PublicNotes.js";
import Recommendations from "./components/Recommendations.js";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/sign" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/homeuser" element={<HomeUser />}></Route>
          <Route path="/addbook" element={<AddBook />}></Route>
          <Route path="/books/:bookId" element={<ViewBook />}></Route>
          <Route path="/booknotes/:userBookId" element={<BookNotes />}></Route>
          <Route path="/profile" element={<UserProfile />}></Route>
          <Route path="/publicnotes" element={<PublicNotes />}></Route>
          <Route path="/recommendations" element={<Recommendations />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
