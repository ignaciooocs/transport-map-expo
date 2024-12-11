import { create } from 'zustand'

interface IUserStore {
    user: any,
    setUser: (user: any) => void  
}

export const useUserStore = create<IUserStore>((set) => ({
    user: false,
    setUser: (user: any) => set({ user }),

}))