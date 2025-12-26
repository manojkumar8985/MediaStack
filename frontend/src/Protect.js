import { Navigate } from "react-router-dom";
import userAuth from "./hooks/useAuthUser";

function ProtectedRoute({ children }) {
  const { user, isLoading } = userAuth();

  if (isLoading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;