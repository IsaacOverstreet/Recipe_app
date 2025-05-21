/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Background from "../assets/edited food.webp";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formType, setFormType] = useState("register");
  const {
    register,
    login,
    registerError,
    loading,
    loginError,
    isAuthenticated,
    dispatch,
  } = useAuth();

  const navigate = useNavigate();

  function emailErrorHandle(email) {
    if (!email) {
      setEmail("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("invalid email format");
    } else {
      setEmailError("");
    }
  }

  function passwordErrorHandling(password) {
    if (!password) {
      setPassword("");
      return;
    }
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
    if (!confirmPassword) {
      setConfirmPassword("");
      return;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError("passsword doesnot match");
    } else {
      setConfirmPasswordError("");
    }
  }
  // handle submit for registration
  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await register(email, password);

      if (!response.success) {
        toast.error(response.error);

        return;
      }

      const loginResppnse = await login(email, password);
      if (!loginResppnse.success) {
        toast.error(response.error);
        console.error("login error :", loginError);
        return;
      }

      navigate("/main");
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  // handle submit for LogIn
  async function handleLogin(e) {
    e.preventDefault();

    const response = await login(email, password);

    if (!response.success) {
      toast.error(response.error);

      return;
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/main");
    }
  }, [isAuthenticated, navigate]);

  //////////// GOOGLE AUTH LOGIN/////////////////////////////////////
  async function handleGoogleLogin() {
    try {
      dispatch({ type: "LOGIN_REQUEST" });
      const newUrl = `${window.location.origin}/api/auth/google/url`;
      const response = await axios.get(newUrl, { withCredentials: true });
      const result = response.data;

      const { url } = result;

      window.location.href = url;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Network failure";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  }

  return (
    <div>
      <div
        className="fixed  min-h-dvh bg-center bg-no-repeat bg-cover w-full h-auto "
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="bg-[rgba(0,0,0,0.45)] solid flex justify-center items-center w-[100%] min-h-dvh ">
          <div className=" bg-[#e1e1e166] rounded-lg p-7  flex justify-center xl:w-[30%] border-box h-auto w-auto ">
            {formType === "register" ? (
              <div className="flex flex-col w-60 lg:w-80 xl:w-[100%] items-center  font-serif">
                <h1 className=" font-Oregano text-shadow-lg tracking-widest cursor-default mb-2">
                  Welcome to ReciPage
                </h1>
                {/* Register form */}
                <form
                  className="flex flex-col gap-1.5 w-[100%]"
                  onSubmit={handleRegister}
                >
                  {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                  <input
                    className="p-2.5 rounded-md bg-[rgba(249,244,244,0.42)]"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => emailErrorHandle(email)}
                    required
                  />

                  {passwordError && (
                    <p style={{ color: "red" }}>{passwordError}</p>
                  )}
                  <input
                    className=" p-2.5 rounded-md bg-[rgba(249,244,244,0.42)]"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => passwordErrorHandling(password)}
                    required
                  />

                  {confirmPasswordError && (
                    <p style={{ color: "red" }}>{confirmPasswordError}</p>
                  )}
                  <input
                    className=" p-2.5 rounded-md bg-[rgba(249,244,244,0.42)]"
                    type="password"
                    placeholder="ConfirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    onBlur={() => confirmPasswordErrrorHandling(password)}
                  />
                  {/* Already have acc Login */}
                  <p className="text-[0.9rem] transition duration-300 transform hover:scale-105 ">
                    Already have account?{" "}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => setFormType("Login")}
                    >
                      logIn
                    </span>
                  </p>

                  {/* signup button */}
                  <button
                    className="p-2.5 rounded-4xl text-white bg-red-700 transition duration-300 transform hover:scale-105  hover:bg-[rgba(232,235,214,0.8)] hover:text-black cursor-pointer"
                    type="submit"
                    disabled={emailError || passwordError || loading}
                  >
                    {loading ? "Registering..." : "Sign up"}
                  </button>

                  {/* registering error alert */}
                  <p>{registerError && registerError}</p>
                </form>

                <p className=" p-4">OR</p>

                {/* google auth */}
                <button
                  className="p-2.5 flex flex-row  justify-between items-center gap-3 rounded-4xl w-[100%] text-white bg-blue-900 transition duration-300 transform hover:scale-105  hover:bg-[rgba(232,235,214,0.8)] hover:text-black cursor-pointer"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle className=" text-2xl flex  relative " />{" "}
                  <span className=" flex-1  text-center">
                    Login with Google
                  </span>
                </button>

                {/*Terms and services  */}
                <p className=" text-[0.65rem] text-center">
                  By continuing, you agree to ReciPage&apos;s{" "}
                  <span className="font-extrabold">
                    Terms of Service and Privacy Policy.
                  </span>
                </p>
                <hr className="w-50 mt-1" />

                {/* END OF FORM */}
              </div>
            ) : (
              ///////////////////////////////////////LOGIN//////////////////////////////////////////////////////////////
              <div className="flex flex-col w-60 lg:w-80 xl:w-[100%] items-center  font-serif">
                {/* Heading */}
                <h1 className=" font-Oregano text-shadow-lg tracking-widest cursor-default mb-2">
                  Welcome to ReciPage
                </h1>
                {/* Begining of form */}
                <form
                  className="flex flex-col gap-1.5 w-[100%]"
                  onSubmit={handleLogin}
                >
                  {/* Email error alert */}
                  {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                  <input
                    className="p-2.5 rounded-md bg-[rgba(249,244,244,0.42)]"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => emailErrorHandle(email)}
                    required
                  />

                  {/* Password error alert */}
                  {passwordError && (
                    <p style={{ color: "red" }}>{passwordError}</p>
                  )}
                  <input
                    className=" p-2.5 rounded-md bg-[rgba(249,244,244,0.42)]"
                    type="text"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => passwordErrorHandling(password)}
                    required
                  />

                  {/* Dont have acc? register */}
                  <p className="text-[0.9rem] transition duration-300 transform hover:scale-105 ">
                    Dont have an account?{" "}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => setFormType("register")}
                    >
                      Register
                    </span>
                  </p>

                  {/* Login button */}
                  <button
                    className="p-2.5 rounded-4xl text-white bg-red-700 transition duration-300 transform hover:scale-105  hover:bg-[rgba(232,235,214,0.8)] hover:text-black cursor-pointer"
                    type="submit"
                    disabled={emailError || passwordError}
                  >
                    {loading ? "Logging In..." : "Login"}
                  </button>
                </form>

                <p className=" p-4">OR</p>

                {/* google auth */}
                <button
                  className="p-2.5 flex flex-row  justify-between items-center gap-3 rounded-4xl w-[100%] text-white bg-blue-900 transition duration-300 transform hover:scale-105  hover:bg-[rgba(232,235,214,0.8)] hover:text-black cursor-pointer"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle className=" text-2xl flex  relative " />{" "}
                  <span className=" flex-1  text-center">
                    Login with Google
                  </span>
                </button>

                {/*Terms and services  */}
                <p className=" text-[0.65rem] text-center">
                  By continuing, you agree to ReciPage&apos;s{" "}
                  <span className="font-extrabold">
                    Terms of Service and Privacy Policy.
                  </span>
                </p>
                <hr className="w-50 mt-1" />
                {/* End */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
