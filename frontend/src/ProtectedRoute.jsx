// import { Navigate } from "react-router-dom";
import { useAuth } from "./hook/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen  bg-[rgba(0,0,0,0.33)] bg-opacity-30 z-50">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
}
export default ProtectedRoute;
