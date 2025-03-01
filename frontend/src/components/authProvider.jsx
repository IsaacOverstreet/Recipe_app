import axios from "axios";
import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  loginError: null,
  registerError: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "REGISTER_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_REQUEST":
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
        isAuthenticated: true,
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
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  async function register(email, password) {
    dispatch({ type: "REGISTER_REQUEST" });

    try {
      const response = await axios.post(
        "http://localhost:3000/recipes/auth/register",
        {
          email: email,
          password: password,
        }
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
      console.log("Register Error:", registerError);

      return { success: false, error: errorMessage };
    }
  }
  const { isAuthenticated, user, loading, registerError } = state;
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, register, registerError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
