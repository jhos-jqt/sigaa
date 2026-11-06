import { create } from "zustand";
import { api } from "../services/api";

const useAuthStore = create((set, get) => ({
  userAuth: {},
  roleAuth: [],
  permissionsAuth: [],
  avatarAuth: null,
  isInitialized: false,

  // Solo actualizas el estado, persist guarda SOLO
  loginAuth: (data) => {
    set({
      userAuth: data.user ?? {},
      roleAuth: data.role ?? [],
      permissionsAuth: data.permissions ?? [],
      avatarAuth: data.avatar ?? null,
      isInitialized: true,
    });
  },

  logoutAuth: () => {
    set({
      userAuth: {},
      roleAuth: [],
      permissionsAuth: [],
      avatarAuth: null,
    });
  },

  updateUserAuth: (dataUser) => {
    set({ userAuth: dataUser.newUserData });
  },

  updateUserAvatarAuth: (dataUserAvatar) => {
    set({ avatarAuth: dataUserAvatar.avatar });
  },

  isAuthenticated: () => Object.keys(get().userAuth ?? {}).length > 0,

  fetchCurrentUser: async () => {
    try {
      const res = await api.get("/api/user");
      const data = res.data;
      set({
        userAuth: data.user ?? {},
        roleAuth: data.role ?? [],
        permissionsAuth: data.permissions ?? [],
        avatarAuth: data.avatar ?? null,
        isInitialized: true,
      });
    } catch {
      set({
        userAuth: {},
        roleAuth: [],
        permissionsAuth: [],
        avatarAuth: null,
        isInitialized: true,
      });
    }
  },

  login: async (credentials) => {
    await api.get("/sanctum/csrf-cookie");
    const res = await api.post("/api/login", credentials);
    return res.data;
  },

  // Paso 2: verificar 2FA -> cookie de sesión creada
  verifyTwoFactor: async ({ user_id, two_factor_code }) => {
    const res = await api.post("/api/verify2fa", { user_id, two_factor_code });
    const data = res.data;
    set({
      userAuth: data.user ?? {},
      roleAuth: data.role ?? [],
      permissionsAuth: data.permissions ?? [],
      avatarAuth: data.avatar ?? null,
      isInitialized: true,
    });
    return data;
  },

  resend2FA: async (user_id) => {
    const res = await api.post("/api/resend2fa", { user_id });
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/api/logout");
    } finally {
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("2fa_expires_at");
      get().logoutAuth();
    }
  },
}));

export default useAuthStore;
