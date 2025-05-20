import { createContext, useContext, useReducer } from "react";

const SpinnerContext = createContext();

const initialState = { spinner: false };

function spinnerReducer(state, action) {
  switch (action.type) {
    case "SET_SPINNER":
      return { spinner: action.payload };

    default:
      return state;
  }
}

export function SpinnerProvider({ children }) {
  const [state, dispatch] = useReducer(spinnerReducer, initialState);
  return (
    <SpinnerContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SpinnerContext.Provider>
  );
}

export const useSpinner = () => useContext(SpinnerContext);
