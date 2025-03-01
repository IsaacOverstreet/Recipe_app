/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { useAuth } from "./authProvider";

function Login({ onClickLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formType, setFormType] = useState("register");
  const { register, registerError, loading } = useAuth();

  function emailErrorHandle(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("invalid email format");
    } else {
      setEmailError("");
    }
  }

  function passwordErrorHandling(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include 1 uppercase letter, and 1 number."
      );
    } else {
      setPasswordError("");
    }
  }

  function confirmPasswordErrrorHandling(password) {
    if (confirmPassword !== password) {
      setConfirmPasswordError("passsword doesnot match");
    } else {
      setConfirmPasswordError("");
    }
  }
  //continue work from here
  async function handleSubmit(e) {
    e.preventDefault();

    const response = await register(email, password);
    if (!response.success) {
      alert(response.error);
      return;
    }

    console.log("User registered successfully:", response.user);
    onClickLogin();
  }

  return (
    <div>
      {formType === "register" ? (
        <div>
          <form className="border flex flex-col gap-4" onSubmit={handleSubmit}>
            <label htmlFor="Email">Email</label>
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            <input
              type="email"
              placeholder="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => emailErrorHandle(email)}
              required
            />
            <label htmlFor="Password">Password</label>
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
            <input
              type="text"
              placeholder="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => passwordErrorHandling(password)}
              required
            />
            <label htmlFor="Confirm Password"> Confirm Password</label>
            {confirmPasswordError && (
              <p style={{ color: "red" }}>{confirmPasswordError}</p>
            )}
            <input
              type="password"
              placeholder="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              onBlur={() => confirmPasswordErrrorHandling(password)}
            />
            <button
              type="submit"
              disabled={emailError || passwordError || loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            {registerError && <p className="error">{registerError}</p>}
          </form>
          <p>
            already have account{" "}
            <button onClick={() => setFormType("Login")}>logIn</button>
          </p>
        </div>
      ) : (
        <form className="border flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="Email">Email</label>
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          <input
            type="email"
            placeholder="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => emailErrorHandle(email)}
            required
          />
          <label htmlFor="Password">Password</label>
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          <input
            type="text"
            placeholder="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => passwordErrorHandling(password)}
            required
          />{" "}
          <button type="submit" disabled={emailError || passwordError}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}
export default Login;
