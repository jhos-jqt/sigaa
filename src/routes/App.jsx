import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "../HOC/PrivateRoutes";
import AuthRoutes from "../HOC/AuthRoutes";
import Layout from "../layouts/Layout";
import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import NotFound from "../features/notfound/Notfound";
import TwoFactorCode from "../features/twofactorcode/TwoFactorCode";
import Unauthorized from "../features/unauthorized/Unauthorized";
import useAuthStore from "../store/authStore";

const App = () => {
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoutes>
              <Login />
            </AuthRoutes>
          }
        />
        <Route path="/twofactorcode" element={<TwoFactorCode />} />
        <Route element={<Layout />}>
          <Route
            path="home"
            element={
              <PrivateRoutes requiredPermission="DASHBOARD">
                <Home />
              </PrivateRoutes>
            }
          />
        </Route>
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
