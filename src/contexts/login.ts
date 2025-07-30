import { create } from "zustand"

export type LoginResponse = {
    user: {
        id: number,
        name: string,
        email: string,
        role: string,
        createdA: string,
        updatedAt: string
    },
    token : string
}

type StoreLogin = {
    user : LoginResponse | null,
    setUser : (user : LoginResponse) => void,
    clear : () => void
}

export const storeLogin = create<StoreLogin>((set) => ({
    user :  null,
    clear : () => set({ user : null}),
    setUser : (user) => set({ user })

}))