import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import useAuthStore from "../../store/authStore";
import logo from "../../assets/images/logo_itibb.webp";
import Loader from "../../components/Loader";

const CODE_EXPIRATION_SECONDS = 120;

const TwoFactorCode = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeErrors, setCodeErrors] = useState({
    user_id: "",
    two_factor_code: "",
    general: "",
  });
  const [buttonText, setButtonText] = useState("Verificar");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonResendText, setButtonResendText] = useState("Solicitar Código");
  const [buttonResendDisabled, setButtonResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const inputRefs = useRef([]);
  const expiresAtRef = useRef(Date.now() + CODE_EXPIRATION_SECONDS * 1000);
  const navigate = useNavigate();

  const verifyTwoFactor = useAuthStore((s) => s.verifyTwoFactor);
  const resend2FA = useAuthStore((s) => s.resend2FA);

  // Redirección temprana si no hay user_id
  useEffect(() => {
    if (!sessionStorage.getItem("user_id")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Inicializar expiresAtRef desde sessionStorage (una sola vez)
  useEffect(() => {
    const expiresAtStr = sessionStorage.getItem("2fa_expires_at");
    const parsed = expiresAtStr ? new Date(expiresAtStr).getTime() : NaN;
    if (Number.isFinite(parsed)) {
      expiresAtRef.current = parsed;
    }
  }, []);

  // Loader inicial + timer leyendo desde el ref
  useEffect(() => {
    const initTimer = setTimeout(() => setIsLoading(false), 1200);

    const tick = () => {
      const diff = Math.floor((expiresAtRef.current - Date.now()) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    };
    tick();
    const timer = setInterval(tick, 1000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index) => (e) => {
    const raw = e.target.value;

    // Pegado de varios caracteres
    if (raw.length > 1) {
      const chars = raw
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 6)
        .split("");

      if (chars.length === 0) return;

      const newCode = [...code];
      chars.forEach((ch, i) => {
        if (index + i < newCode.length) newCode[index + i] = ch;
      });

      setCode(newCode);

      const nextIndex = Math.min(
        index + chars.length,
        inputRefs.current.length - 1,
      );
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 10);
      return;
    }

    // Escritura normal (reemplaza el valor actual)
    const val = raw.slice(-1).toUpperCase();
    if (!/^[A-Z0-9]?$/.test(val)) return;

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    if (val && index < inputRefs.current.length - 1) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
    }
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
        e.preventDefault();
      } else if (index > 0) {
        e.preventDefault();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("").toUpperCase();
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
      setCodeErrors({ general: "Sesión no válida. Vuelva a iniciar sesión." });
      navigate("/", { replace: true });
      return;
    }

    if (verificationCode.length !== 6) {
      setCodeErrors({ general: "Ingrese los 6 caracteres del código." });
      return;
    }

    setIsButtonDisabled(true);
    setButtonText("Verificando...");
    setCodeErrors({ user_id: "", two_factor_code: "", general: "" });

    try {
      await verifyTwoFactor({
        user_id: userId,
        two_factor_code: verificationCode,
      });
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("2fa_expires_at");
      navigate("/home", { replace: true });
    } catch (error) {
      const status = error.response?.status;
      if (status === 429) {
        setCodeErrors({
          general: "Demasiados intentos. Solicite un nuevo código.",
        });
      } else if (status === 419) {
        setCodeErrors({
          general: "Sesión expirada. Recargue la página e intente de nuevo.",
        });
      } else if (error.response?.data?.errors) {
        setCodeErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      } else {
        setCodeErrors({ general: "Código inválido o expirado." });
      }
    } finally {
      setButtonText("Verificar");
      setIsButtonDisabled(false);
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("user_id");

    if (!userId) {
      setCodeErrors({ general: "Sesión no válida. Vuelva a iniciar sesión." });
      navigate("/", { replace: true });
      return;
    }

    setButtonResendDisabled(true);
    setButtonResendText("Enviando...");
    setCodeErrors({ user_id: "", two_factor_code: "", general: "" });

    let res = null;
    let resendOk = false;

    try {
      res = await resend2FA(userId);
      resendOk = true;
    } catch (error) {
      const status = error.response?.status;
      if (status === 429) {
        setCodeErrors({
          general: "Demasiadas solicitudes. Espere un momento.",
        });
      } else if (status === 419) {
        setCodeErrors({
          general: "Sesión expirada. Recargue la página.",
        });
      } else {
        setCodeErrors({
          general: "Error al reenviar el código. Inténtelo más tarde.",
        });
      }
    } finally {
      setButtonResendText("Solicitar Código");
      setButtonResendDisabled(false);
    }

    if (!resendOk) return;

    // Reenvío exitoso: limpiar errores, inputs y refrescar expiración
    setCodeErrors({ user_id: "", two_factor_code: "", general: "" });
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    const newExpiresAt = res?.expires_at
      ? new Date(res.expires_at).getTime()
      : NaN;

    const finalExpiresAt = Number.isFinite(newExpiresAt)
      ? newExpiresAt
      : Date.now() + CODE_EXPIRATION_SECONDS * 1000;

    // 🔑 CLAVE: actualizar el ref para que el setInterval lo lea en el próximo tick
    expiresAtRef.current = finalExpiresAt;

    if (res?.expires_at) {
      sessionStorage.setItem("2fa_expires_at", res.expires_at);
    }

    const diff = Math.floor((finalExpiresAt - Date.now()) / 1000);
    setTimeLeft(diff > 0 ? diff : 0);

    try {
      Toast.fire({
        icon: "success",
        title: "Código enviado. Verifique su correo electrónico.",
      });
    } catch {
      // si el toast falla, no rompe el flujo
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-navy-blue">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
      </div>
      <div className="relative flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-lg">
          <div className="overflow-hidden bg-white border rounded-3xl shadow-2xl">
            <div className="px-6 py-8 sm:p-10">
              <div className="flex justify-center mb-6">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-28 h-auto transition-transform hover:scale-105"
                />
              </div>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-navy-blue mb-2">
                  Código de Verificación
                </h1>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Ingrese el código de verificación de 6 caracteres que se envió
                  a su correo electrónico
                </p>
                <div className="mt-4">
                  {timeLeft > 0 ? (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-navy-blue">
                        Código válido por:{" "}
                        <span className="font-bold">
                          {formatTime(timeLeft)}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm font-medium text-red-700">
                        Código expirado, por favor solicite uno nuevo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {(codeErrors.general ||
                codeErrors.two_factor_code ||
                codeErrors.user_id) && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {codeErrors.general && (
                    <p className="text-sm text-red-600 text-center">
                      {codeErrors.general}
                    </p>
                  )}
                  {codeErrors.two_factor_code && (
                    <p className="text-sm text-red-600 text-center">
                      {codeErrors.two_factor_code}
                    </p>
                  )}
                  {codeErrors.user_id && (
                    <p className="text-sm text-red-600 text-center">
                      {codeErrors.user_id}
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="text"
                      value={digit || ""}
                      onChange={handleChange(index)}
                      onKeyDown={handleKeyDown(index)}
                      onFocus={(e) => e.target.select()}
                      className="
                        w-12 h-14 sm:w-14 sm:h-16
                        text-center text-2xl font-bold
                        bg-slate-50 border border-slate-300 rounded-xl text-slate-900
                        caret-navy-blue
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue
                        hover:border-navy-blue
                        select-none
                        uppercase cursor-pointer
                      "
                      maxLength={1}
                      autoComplete="off"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className="relative w-full py-3 px-4 text-white bg-navy-blue rounded-lg shadow-md hover:bg-navy-blue focus:outline-none focus:ring-2 focus:ring-navy-blue focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {isButtonDisabled ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{buttonText}</span>
                    </div>
                  ) : (
                    <span>{buttonText}</span>
                  )}
                </button>
              </form>

              {timeLeft === 0 && (
                <div className="mt-3">
                  <button
                    type="button"
                    disabled={buttonResendDisabled}
                    onClick={handleResendCode}
                    className="w-full py-3 px-4 text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {buttonResendDisabled ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                        <span>{buttonResendText}</span>
                      </div>
                    ) : (
                      <span>{buttonResendText}</span>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  onClick={() => {
                    sessionStorage.removeItem("user_id");
                    sessionStorage.removeItem("2fa_expires_at");
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy-blue transition-colors"
                >
                  <FaArrowLeft className="text-xs" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorCode;
