import { create } from "zustand";
export const storeLogin = create((set) => ({
    user: null,
    clear: () => set({ user: null }),
    setUser: (user) => set({ user })
}));
