import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";
//import avatarImage from '../../assets/images/avatard.png';
import logo from "../assets/images/logo_itibb.webp";

const Navbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { userAuth, avatarAuth, logout } = useAuthStore();
  const { setSidebarMovile } = useUiStore();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } finally {
      setIsDropdownOpen(false);
      navigate("/", { replace: true });
    }
  };

  return (
    // Navbar blanca con sombra sutil y borde inferior suave
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo y botón hamburguesa */}
        <div className="flex items-center gap-3">
          {/* Botón colapsar sidebar (Desktop) */}
          {/*<button
            type="button"
            className="hidden lg:flex items-center justify-center p-2 text-slate-500 rounded-lg hover:text-navy-blue hover:bg-slate-100 transition-colors"
            onClick={onToggleSidebar}
          >
            <i
              className={`fas fa-${sidebarCollapsed ? "angle-right" : "angle-left"} text-lg`}
            ></i>  COrregir
          </button>*/}

          {/* Botón menú móvil */}
          <button
            type="button"
            className="p-2 text-slate-500 rounded-lg hover:text-navy-blue hover:bg-slate-100 lg:hidden transition-colors"
            onClick={() => setSidebarMovile(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img src={logo} className="w-8 h-8" alt="logo" />
            <span className="text-xl font-bold text-navy-blue hidden sm:inline tracking-tight">
              SIGAA
            </span>
          </Link>
        </div>

        {/* Menú de usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src="ss"
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
            <span className="hidden text-sm font-medium text-slate-700 md:inline">
              {userAuth?.primer_nombre || "Usuario"}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              {/* Header del Dropdown con datos del usuario */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {userAuth?.primer_nombre} {userAuth?.apellido_paterno}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {userAuth?.email || "usuario@itibb.edu.bo"}
                </p>
              </div>

              <div className="py-1.5">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-navy-blue transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mi Perfil
                </Link>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
