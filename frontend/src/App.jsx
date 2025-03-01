/* eslint-disable no-unused-vars */
import React from "react";
import "./App.css";
import Login from "./components/Login";
import MainUI from "./components/MainUI";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./components/authProvider";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}
export default App;
