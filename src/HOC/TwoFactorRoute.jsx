import { Navigate } from "react-router-dom";

const TwoFactorRoute = ({ children }) => {
  const userId = sessionStorage.getItem("user_id");
  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default TwoFactorRoute;
