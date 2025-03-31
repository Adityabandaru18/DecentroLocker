import { create } from "zustand";

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

const useStore = create<Main>((set, get) => ({
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
}));

export default useStore;