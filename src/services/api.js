import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Viene del .env
  withCredentials: true, // Envía la cookie de sesión de Sanctum
  withXSRFToken: true, // Añade el header X-XSRF-TOKEN automáticamente
});
