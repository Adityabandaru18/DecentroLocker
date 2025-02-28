import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";  // ✅ Import persist middleware

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface Main {
  wallet: string;
  user: User;
  addWallet: (wallet: string) => void;
  getWallet: () => string;
  addUser: (user: User) => void;
  getUser: () => User;
}

const useStore = create<Main>()(
  persist(   
    (set, get) => ({
      wallet: "",
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "",
      },
      addWallet: (wallet) => {
        set({ wallet });
      },
      getWallet: () => get().wallet,
      addUser: (user) => {
        set({ user });
      },
      getUser: () => get().user,
    }),
    {
      name: "user-storage", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default useStore;
