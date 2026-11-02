import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
// Importamos los íconos que usaremos (Lucide Icons)
import {
  LuLayoutDashboard,
  LuShieldCheck,
  LuUsers,
  LuBriefcase,
  LuUserPlus,
  LuGraduationCap,
  LuBookOpen,
  LuCalendarDays,
  LuClipboardList,
  LuFileSpreadsheet,
  LuMapPin,
  LuAward,
  LuChevronDown,
  LuSettings,
} from "react-icons/lu";
//import avatarImage from "../../assets/images/avatard.png";

const SidebarItem = ({ icon: Icon, text, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center px-3 py-2.5 my-0.5 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-white/10 text-white font-medium shadow-sm"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon className="w-5 h-5 mr-3 group-[.sidebar-collapsed]:mr-0 group-[.sidebar-collapsed]:w-full flex-shrink-0 transition-transform group-hover:scale-110" />
      <span className="text-sm group-[.sidebar-collapsed]:hidden group-hover/sidebar:inline whitespace-nowrap">
        {text}
      </span>
      {/* Indicador visual sutil para el item activo */}
      {isActive && (
        <div className="absolute right-0 w-1 h-6 bg-blue-400 rounded-l-full group-[.sidebar-collapsed]:hidden"></div>
      )}
    </NavLink>
  );
};

const SidebarDropdown = ({ icon: Icon, text, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-slate-400 hover:bg-white/5 hover:text-white"
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-3 group-[.sidebar-collapsed]:mr-0 group-[.sidebar-collapsed]:w-full flex-shrink-0 transition-transform group-hover:scale-110" />
          <span className="text-sm group-[.sidebar-collapsed]:hidden group-hover/sidebar:inline whitespace-nowrap">
            {text}
          </span>
        </div>
        <LuChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} group-[.sidebar-collapsed]:hidden group-hover/sidebar:inline flex-shrink-0`}
        />
      </button>

      {/* Submenú con animación de apertura */}
      <div
        className={`ml-4 space-y-0.5 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ onClose, isCollapsed }) => {
  const { userAuth, avatarAuth, roleAuth } = useAuthStore();

  return (
    <div
      className={`flex flex-col h-full bg-navy-blue border-r border-white/10 shadow-2xl overflow-x-hidden ${isCollapsed ? "sidebar-collapsed" : ""}`}
    >
      {/* Perfil */}
      <div
        className={`p-4 border-b border-white/10 ${isCollapsed ? "flex justify-center" : ""}`}
      >
        {isCollapsed ? (
          <img
            //src={avatarAuth || avatarImage}
            src="ss"
            alt="Avatar"
            className="w-9 h-9 rounded-full ring-2 ring-white/20 object-cover"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                //src={avatarAuth || avatarImage}
                src="ss"
                alt="Avatar"
                className="w-10 h-10 rounded-full ring-2 ring-white/20 object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-navy-blue rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userAuth?.primer_nombre || "Usuario"}
              </p>
              <p className="text-xs text-blue-200 truncate capitalize">
                {roleAuth || "Rol"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navegación - Menús del Sistema */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div className="px-3 space-y-1">
          <SidebarItem icon={LuLayoutDashboard} text="Inicio" to="/home" />

          {/* Módulo Administrativo */}
          <SidebarDropdown icon={LuSettings} text="Administración">
            <SidebarItem
              icon={LuShieldCheck}
              text="Permisos"
              to="/permissions"
            />
            <SidebarItem icon={LuUsers} text="Roles" to="/roles" />
            <SidebarItem icon={LuBriefcase} text="Cargos" to="/cargos" />
            <SidebarItem icon={LuUserPlus} text="Usuarios" to="/users" />
          </SidebarDropdown>

          {/* Módulo Académico */}
          <SidebarDropdown icon={LuGraduationCap} text="Gestión Académica">
            <SidebarItem icon={LuBookOpen} text="Carreras" to="/carreras" />
            <SidebarItem
              icon={LuClipboardList}
              text="Planes de Estudio"
              to="/planes"
            />
            <SidebarItem
              icon={LuBookOpen}
              text="Asignaturas"
              to="/asignaturas"
            />
            <SidebarItem icon={LuCalendarDays} text="Periodos" to="/periodos" />
            <SidebarItem icon={LuUsers} text="Estudiantes" to="/estudiantes" />
            <SidebarItem icon={LuUserPlus} text="Docentes" to="/docentes" />
          </SidebarDropdown>

          {/* Módulo de Operaciones */}
          <SidebarDropdown
            icon={LuClipboardList}
            text="Inscripciones y Horarios"
          >
            <SidebarItem
              icon={LuFileSpreadsheet}
              text="Inscripciones"
              to="/inscripciones"
            />
            <SidebarItem
              icon={LuCalendarDays}
              text="Horarios y Aulas"
              to="/horarios"
            />
            <SidebarItem icon={LuMapPin} text="Aulas" to="/aulas" />
          </SidebarDropdown>

          {/* Evaluación y Pasantías */}
          <SidebarDropdown icon={LuFileSpreadsheet} text="Evaluación">
            <SidebarItem
              icon={LuClipboardList}
              text="Calificaciones"
              to="/calificaciones"
            />
            <SidebarItem
              icon={LuFileSpreadsheet}
              text="Centralizador"
              to="/centralizador"
            />
            <SidebarItem icon={LuBriefcase} text="Pasantías" to="/pasantias" />
          </SidebarDropdown>

          {/* Titulación y Reportes */}
          <SidebarItem icon={LuAward} text="Titulación" to="/titulacion" />
          <SidebarItem
            icon={LuFileSpreadsheet}
            text="Reportes"
            to="/reportes"
          />
        </div>
      </nav>

      <div className="p-4 border-t border-white/10 text-xs text-center text-blue-300/60">
        <p>© {new Date().getFullYear()} - ITIBB</p>
      </div>
    </div>
  );
};

export default Sidebar;
