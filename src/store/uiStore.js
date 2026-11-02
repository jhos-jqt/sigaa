import { create } from 'zustand';

const useUiStore = create((set) => ({
  sidebarMovile: false,
  setSidebarMovile: (value) => set({ sidebarMovile: value }),
  sidebarCollapsed: false,           // nuevo: colapsado en desktop
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

export default useUiStore;