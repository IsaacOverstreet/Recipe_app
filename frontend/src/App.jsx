/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import MainUI from "./components/MainUI";
import { Routes, Route, useNavigation, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import GoogleAuth from "./components/GoogleAuth";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./hook/useAuth";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  return (
    <div>
      <LoadingScreen />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainUI />
            </ProtectedRoute>
          }
        />
        {/* fallback route */}
        <Route path="*" element={<Login />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Footer />
    </div>
  );
}
export default App;
