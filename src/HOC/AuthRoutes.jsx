import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AuthRoutes = ({ children }) => {
  const location = useLocation();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // 1. Si no está inicializado, muestra un loader (o null)
  if (!isInitialized) return null;

  // 2. Si YA está autenticado (tiene token), lo mandamos al home
  if (isAuthenticated()) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // 3. Si NO está autenticado, lo dejamos pasar (Login, 2FA, etc.)
  return children;
};

export default AuthRoutes;
