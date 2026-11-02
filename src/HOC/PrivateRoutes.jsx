import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const PrivateRoutes = ({ children, requiredPermission }) => {
  const location = useLocation();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const permissionsAuth = useAuthStore((s) => s.permissionsAuth);

  if (!isInitialized) return null;

  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requiredPermission && !permissionsAuth.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoutes;
