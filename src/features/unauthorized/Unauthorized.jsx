import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Contenedor principal con tarjeta blanca */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">

        {/* Patrón decorativo de fondo sutil */}
        <div className="absolute top-0 left-0 w-full h-32 bg-navy-blue/5"></div>

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center">

          {/* Código de error con efecto de sombra */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-24 bg-navy-blue/10 rounded-full blur-3xl"></div>
            </div>
            <h1 className="relative text-8xl sm:text-9xl font-extrabold text-slate-800 tracking-tighter">
              4<span className="text-navy-blue">0</span>3
            </h1>
          </div>

          {/* Icono de advertencia con fondo circular suave */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm transform rotate-3">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Mensajes de texto */}
          <h2 className="mb-3 text-2xl font-bold text-slate-800 sm:text-3xl">
            Acceso Restringido
          </h2>
          <p className="max-w-md mx-auto mb-10 text-slate-500 leading-relaxed">
            Lo sentimos, no tienes los permisos necesarios para acceder a este módulo del sistema.
            Si crees que esto es un error, por favor contacta al administrador.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-navy-blue rounded-xl hover:bg-navy-blue-light focus:outline-none focus:ring-2 focus:ring-navy-blue focus:ring-offset-2 transition-all duration-200 shadow-md transform active:scale-95"
              onClick={() => navigate(-1)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver atrás
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-200 transform active:scale-95"
              onClick={() => navigate('/home')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
