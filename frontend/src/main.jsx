import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./components/authProvider.jsx";
import { SpinnerProvider } from "./components/LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    <SpinnerProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SpinnerProvider>
  </BrowserRouter>
);
