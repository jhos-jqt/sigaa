import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserLarge, FaLock, FaEyeSlash, FaEye } from "react-icons/fa6";
import logo from "../../assets/images/logo_itibb.webp";
import fotoItibb from "../../assets/images/foto_itibb.webp";
import useAuthStore from "../../store/authStore";
import Loader from "../../components/Loader";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState({
    username: "",
    password: "",
    credentials: "",
    general: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonText, setButtonText] = useState("Ingresar");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  const handleChange = (input) => (e) => {
    e.preventDefault();
    setLoginData({ ...loginData, [input]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    setButtonText("Verificando...");
    try {
      const response = await loginStore(loginData);
      if (response.success) {
        sessionStorage.setItem("user_id", response.user_id);
        sessionStorage.setItem("2fa_expires_at", response.expires_at);
        navigate("/twofactorcode", { replace: true });
      } else {
        setLoginErrors({
          general: "No se puedo enviar el código 2FA. Inténtelo nuevamente.",
        });
        setButtonText("Ingresar");
        setIsButtonDisabled(false);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setLoginErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      } else if (error.response?.status === 429) {
        setLoginErrors({ general: "Demasiados intentos. Espere un momento." });
      } else {
        setLoginErrors({
          general: "No se pudo iniciar sesión, inténtelo más tarde.",
        });
      }
      setButtonText("Ingresar");
      setIsButtonDisabled(false);
    }
  };

  const today = new Date();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="relative min-h-screen bg-navy-blue overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      </div>
      <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div className="overflow-hidden bg-white rounded-2xl shadow-2xl backdrop-blur-sm bg-opacity-95">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 space-y-6 sm:p-10">
                {/* Logo */}
                <div className="flex justify-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-28 h-auto transition-transform hover:scale-105"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 text-slate-500 bg-white font-medium">
                      Acceso al Sistema
                    </span>
                  </div>
                </div>

                {/* Mensajes de error */}
                {(loginErrors.credentials || loginErrors.general) && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">
                      {loginErrors.credentials || loginErrors.general}
                    </p>
                  </div>
                )}

                {/* Formulario */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Usuario
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaUserLarge
                          className={`transition-colors ${loginErrors.username ? "text-red-400" : "text-slate-400 group-focus-within:text-navy-blue"}`}
                        />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className={`block w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navy-blue focus:border-navy-blue ${
                          loginErrors.username
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-slate-300"
                        }`}
                        placeholder="Ingresa tu usuario"
                        onChange={handleChange("username")}
                      />
                    </div>
                    {loginErrors.username && (
                      <p className="mt-1 text-xs text-red-600">
                        {loginErrors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaLock
                          className={`transition-colors ${loginErrors.password ? "text-red-400" : "text-slate-400 group-focus-within:text-navy-blue"}`}
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`block w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navy-blue focus:border-navy-blue ${
                          loginErrors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-slate-300"
                        }`}
                        placeholder="Ingresa tu contraseña"
                        onChange={handleChange("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-navy-blue transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="mt-1 text-xs text-red-600">
                        {loginErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="remember-check"
                        className="w-4 w-4 h-4 text-navy-blue border-slate-300 rounded focus:ring-navy-blue transition-colorsh-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        Recordarme
                      </span>
                    </label>
                    <a
                      href="/olvide-contraseña"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  {/* Botón Submit */}
                  <button
                    type="submit"
                    id="login-button"
                    disabled={isButtonDisabled}
                    className="relative w-full py-3 overflow-hidden text-white bg-navy-blue rounded-lg shadow-md hover:bg-navy-blue focus:outline-none focus:ring-2 focus:ring-navy-blue focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] cursor-pointer"
                  >
                    {isButtonDisabled ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <span className="font-semibold">{buttonText}</span>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="pt-4 text-center">
                  <p className="text-xs text-gray-500">
                    © {today.getFullYear()} - ITIBB. Desarrollado por
                    <a
                      href="https://github.com/jhos-jqt"
                      className="ml-1 text-blue-600 hover:text-blue-700 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Jhosmir
                    </a>
                  </p>
                </div>
              </div>

              {/* Lado derecho - Imagen decorativa */}
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
                <img
                  src={fotoItibb}
                  alt="Foto ITIBB"
                  className="object-cover w-full h-full"
                  style={{ height: "100%" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-lg font-semibold">
                    Sistema Integral de Gestión Académica y Administrativa
                  </p>
                  <p className="text-sm opacity-90">
                    Administra los procesos académicos y administrativos
                    relacionados de forma eficiente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rounded-2xl {
          border-radius: 1.5rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
