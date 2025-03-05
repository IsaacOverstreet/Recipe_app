/* eslint-disable no-unused-vars */
import React from "react";
import "./App.css";
import Login from "./components/Login";
import MainUI from "./components/MainUI";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainUI />} />
      </Routes>
    </div>
  );
}
export default App;
