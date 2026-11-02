import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Tarjeta contenedora */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">

        {/* Patrón decorativo sutil en la parte superior */}
        <div className="absolute top-0 left-0 w-full h-32 bg-navy-blue/5"></div>

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center">

          {/* Código 404 con efecto */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-24 bg-navy-blue/10 rounded-full blur-3xl"></div>
            </div>
            <h1 className="relative text-8xl sm:text-9xl font-extrabold text-slate-800 tracking-tighter">
              4<span className="text-navy-blue">0</span>4
            </h1>
          </div>

          {/* Icono de búsqueda (más amigable que una advertencia) */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm transform -rotate-3">
              <svg
                className="w-10 h-10 text-navy-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Mensajes */}
          <h2 className="mb-3 text-2xl font-bold text-slate-800 sm:text-3xl">
            Página no encontrada
          </h2>
          <p className="max-w-md mx-auto mb-10 text-slate-500 leading-relaxed">
            Lo sentimos, la página que estás buscando no existe, ha sido movida o la dirección está mal escrita.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-200 transform active:scale-95"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver atrás
            </button>

            <button
              type="button"
              onClick={() => navigate('/home')}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-navy-blue rounded-xl hover:bg-navy-blue-light focus:outline-none focus:ring-2 focus:ring-navy-blue focus:ring-offset-2 transition-all duration-200 shadow-md transform active:scale-95"
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

export default NotFound;
