import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import PrivateRoutes from "../HOC/PrivateRoutes";
import AuthRoutes from "../HOC/AuthRoutes";
import TwoFactorRoute from "../HOC/TwoFactorRoute";
import Layout from "../layouts/Layout";
import AulasPage from "../features/aulas/AulasPage";
import CarrerasPage from "../features/carreras/CarrerasPage";
import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import NotFound from "../features/notfound/Notfound";
import TwoFactorCode from "../features/twofactorcode/TwoFactorCode";
import Unauthorized from "../features/unauthorized/Unauthorized";
import useAuthStore from "../store/authStore";
import PlanesEstudioPage from "../features/planes/PlanesEstudioPage";

// Creamos un componente interno para poder usar useLocation
const AppRoutes = () => {
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);
  const location = useLocation();

  useEffect(() => {
    // Rutas donde NO queremos pedir el usuario (evita el 401 en consola)
    const isAuthRoute =
      location.pathname === "/" || location.pathname === "/twofactorcode";

    if (!isAuthRoute) {
      fetchCurrentUser();
    } else {
      // Si estamos en login o 2FA, decimos que la app ya cargó para que no se quede en blanco
      useAuthStore.setState({ isInitialized: true });
    }
  }, [fetchCurrentUser, location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRoutes>
            <Login />
          </AuthRoutes>
        }
      />
      <Route
        path="/twofactorcode"
        element={
          <TwoFactorRoute>
            <TwoFactorCode />
          </TwoFactorRoute>
        }
      />

      <Route element={<Layout />}>
        <Route
          path="home"
          element={
            <PrivateRoutes requiredPermission="DASHBOARD">
              <Home />
            </PrivateRoutes>
          }
        />
        <Route path="/aulas" element={<AulasPage />} />
        <Route path="/carreras" element={<CarrerasPage />} />
        <Route path="/planes" element={<PlanesEstudioPage />} />
      </Route>

      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
