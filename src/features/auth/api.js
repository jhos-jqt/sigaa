import { api } from "../../services/api";

/*const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  withXSRFToken: true,
});

api.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match[1]);
  }
  return config;
  });*/

export const login = async (loginData) => {
  const response = await api.post("/api/login", loginData);
  return response.data;
};

export const twofactor = async (verificationCode, userId) => {
  const response = await api.post("/api/verify2fa", {
    two_factor_code: verificationCode,
    user_id: userId,
  });

  return response.data;
};

export const resendTwoFactorCode = async (userId) => {
  const response = await api.post("/api/resend2fa", { user_id: userId });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/user");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/api/logout");
  return response.data;
};
