import logo from '../assets/images/logo_itibb.webp';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0B2A5B]/80 backdrop-blur-md z-50 transition-all duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#3B82F6] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-[#0B2A5B]/50 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg shadow-black/20">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-sm font-semibold tracking-wider uppercase">
            Cargando sistema...
          </p>
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Loader;
