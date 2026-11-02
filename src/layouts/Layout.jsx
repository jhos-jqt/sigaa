import { Outlet } from 'react-router-dom';
import useUiStore from '../store/uiStore';
import MainNavbar from '../components/Navbar';
import MainSidebar from '../components/Sidebar';

const Layout = () => {
  const { sidebarMovile, setSidebarMovile, sidebarCollapsed, toggleSidebarCollapsed } = useUiStore();

  return (
    // 1. Fondo general más limpio (slate-50 es el estándar para dashboards)
    <div className="relative min-h-screen bg-slate-50">

      {/* Navbar fijo (h-16 = 64px de altura estándar en Tailwind) */}
      <MainNavbar onToggleSidebar={toggleSidebarCollapsed} sidebarCollapsed={sidebarCollapsed} />

      {/* Sidebar */}
      <aside
        className={`fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)] transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.05)] group/sidebar
          ${sidebarMovile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-20 hover:lg:w-64' : 'lg:w-64'}`}
      >
        <MainSidebar onClose={() => setSidebarMovile(false)} isCollapsed={sidebarCollapsed} />
      </aside>

      {/* Overlay para móviles (fondo oscuro con blur) */}
      {sidebarMovile && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarMovile(false)}
        />
      )}

      {/* Contenedor del contenido principal */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* mt-16 para dejar espacio debajo del navbar fijo */}
        <main className="p-4 mt-16 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Layout;
