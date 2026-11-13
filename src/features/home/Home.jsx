import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  LuGraduationCap,
  LuUsers,
  LuBookOpen,
  LuSignature,
  LuTrendingUp,
  LuCheck,
  LuClock,
  LuTriangleAlert,
  LuUserPlus,
  LuClipboardCheck,
  LuAward,
  LuCircleAlert,
  LuClipboardList,
  LuChartPie,
} from "react-icons/lu";
import Loader from "../../components/Loader";
// import LinkBreadcrumb from '../components/breadcrumbs/LinkBreadcrumb'; // Lo dejamos comentado si no lo usas aún
//import avatarImage from '../assets/images/avatard.png';

const Home = () => {
  const { userAuth, avatarAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const hour = today.getHours();

  const getGreeting = () => {
    if (hour < 12) return "¡Buenos días!";
    if (hour < 18) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const justLoggedIn = localStorage.getItem("justLoggedIn") === "true";
    if (justLoggedIn) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.removeItem("justLoggedIn");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Tarjeta de bienvenida */}
      <div className="relative overflow-hidden bg-navy-blue rounded-3xl shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>

        <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 z-10">
            <p className="text-sm font-medium text-blue-200 uppercase tracking-wider">
              {formattedDate}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {getGreeting()}, {userAuth?.primer_nombre || "Usuario"}
            </h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Bienvenido al Sistema Integral de Gestión Académica del ITIBB.
              Aquí tienes el resumen de hoy.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-4 z-10">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <LuGraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de estadísticas académicas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Estudiantes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Estudiantes Activos
              </p>
              <p className="text-3xl font-bold text-slate-800 mt-2">1,248</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-navy-blue transition-colors duration-300">
              <LuUsers className="w-6 h-6 text-navy-blue group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-max px-2.5 py-1 rounded-md">
            <LuTrendingUp className="w-4 h-4 mr-1.5" />
            <span>12% vs semestre anterior</span>
          </div>
        </div>

        {/* Docentes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Plantel Docente
              </p>
              <p className="text-3xl font-bold text-slate-800 mt-2">86</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
              <LuBookOpen className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-slate-600 bg-slate-100 w-max px-2.5 py-1 rounded-md">
            <LuCheck className="w-4 h-4 mr-1.5" />
            <span>4 nuevos contratados</span>
          </div>
        </div>

        {/* Cursos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Cursos en Curso
              </p>
              <p className="text-3xl font-bold text-slate-800 mt-2">42</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
              <LuClipboardList className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-max px-2.5 py-1 rounded-md">
            <LuClock className="w-4 h-4 mr-1.5" />
            <span>Periodo I/2026</span>
          </div>
        </div>

        {/* Inscripciones Pendientes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Por Revisar</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">15</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
              <LuSignature className="w-6 h-6 text-amber-500 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-amber-600 bg-amber-50 w-max px-2.5 py-1 rounded-md">
            <LuTriangleAlert className="w-4 h-4 mr-1.5" />
            <span>Inscripciones pendientes</span>
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">
              Últimos Movimientos
            </h3>
            <button className="text-sm font-medium text-navy-blue hover:underline">
              Ver todo
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              {
                action: "Nueva inscripción registrada",
                user: "Juan Pérez (Estudiante)",
                time: "Hace 5 min",
                Icon: LuUserPlus,
                color: "bg-blue-100 text-blue-600",
              },
              {
                action: "Calificaciones subidas - 3er Semestre",
                user: "Ing. María López",
                time: "Hace 1 hora",
                Icon: LuClipboardCheck,
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                action: "Pasantía aprobada",
                user: "Comisión Académica",
                time: "Hace 3 horas",
                Icon: LuAward,
                color: "bg-purple-100 text-purple-600",
              },
              {
                action: "Documento observado",
                user: "Secretaría",
                time: "Hace 5 horas",
                Icon: LuCircleAlert,
                color: "bg-amber-100 text-amber-600",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}
                >
                  <item.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.action}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    por {item.user}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              Accesos Rápidos
            </h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/estudiantes"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-navy-blue hover:border-navy-blue transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <LuUsers className="w-5 h-5 text-navy-blue group-hover:text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-white text-center">
                  Estudiantes
                </span>
              </Link>

              <Link
                to="/inscripciones"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-navy-blue hover:border-navy-blue transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <LuSignature className="w-5 h-5 text-navy-blue group-hover:text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-white text-center">
                  Inscripciones
                </span>
              </Link>

              <Link
                to="/calificaciones"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-navy-blue hover:border-navy-blue transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <LuClipboardList className="w-5 h-5 text-navy-blue group-hover:text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-white text-center">
                  Calificaciones
                </span>
              </Link>

              <Link
                to="/reportes"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-navy-blue hover:border-navy-blue transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <LuChartPie className="w-5 h-5 text-navy-blue group-hover:text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-white text-center">
                  Reportes
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
