import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AuthRoutes = ({ children }) => {
  const location = useLocation();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isInitialized) return null;
  if (!isAuthenticated()) {
    return children;
  }
  return <Navigate to="/home" state={{ from: location }} />;
};

export default AuthRoutes;
