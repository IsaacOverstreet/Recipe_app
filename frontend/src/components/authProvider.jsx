import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  loginError: null,
  registerError: null,
  logoutError: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "REGISTER_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGOUT_REQUEST":
      return { ...state, loading: true, error: null };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload,
        loading: false,
      };
    case "VALIDATOR":
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload,
        loading: false,
      };

    case "REGISTER_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        registerError: action.payload,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        loginError: action.payload,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case "LOGOUT_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        logoutError: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Example Axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  // FUNCTION CHECK IF THE SESSION IS VALIDATED
  async function sessionValidator() {
    try {
      const response = await api.get(
        // 1///
        "/api/recipes/session-validator",
        {
          withCredentials: true,
        }
      );

      if (response.data.user) {
        dispatch({
          type: "VALIDATOR",
          payload: response.data.authenticated,
        });
      }
    } catch (error) {
      console.error("session validator failed", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  //  AUTOMATIC CHECK ON MOUNT
  useEffect(() => {
    sessionValidator();
  }, []);

  // Passport Local strategy for Registration
  async function register(email, password) {
    dispatch({ type: "REGISTER_REQUEST" });

    try {
      // 2///
      const response = await api.post(
        "/api/auth/register",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      dispatch({ type: "REGISTER_SUCCESS", payload: response.data.user });

      return { success: true, user: response.data.user };
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "Network error";

      dispatch({
        type: "REGISTER_FAILURE",
        payload: error.response.data.message,
      });

      return { success: false, error: errorMessage };
    }
  }

  ////////// Passport Local strategy for Login//////////////
  async function login(email, password) {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      //3//
      const response = await api.post(
        "/api/auth/login",
        { email: email, password: password },
        { withCredentials: true }
      );

      dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });

      return { success: true, user: response.data.user };
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "Network error";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  /////////////// LOGOUT CONTROL////////////
  async function logout() {
    try {
      dispatch({ type: "LOGOUT_REQUEST" });
      //4//
      const response = await api.get("/api/auth/logout", {
        withCredentials: true,
      });

      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      localStorage.removeItem("recipes");

      if (response.data.success) {
        dispatch({ type: "LOGOUT_SUCCESS" });
        navigate("/");
        return { sucess: true, data: response.data };
      } else {
        dispatch({
          type: "LOGOUT_FAILURE",
          payload: response.data.message || "Logout failure on server",
        });
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || "Logout failed"
        : "Network error - please check your connection";
      dispatch({ type: "LOGOUT_FAILURE", payload: errorMessage });
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      return { success: false, error: errorMessage };
    }
  }

  const { isAuthenticated, user, loading, registerError, loginError } = state;
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        register,
        login,
        registerError,
        loginError,
        dispatch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
