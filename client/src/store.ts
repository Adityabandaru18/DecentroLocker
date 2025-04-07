import { create } from "zustand";



interface Main {
  wallet: string;
  addWallet: (wallet: string) => void;
  getWallet: () => string;

}

const useStore = create<Main>((set, get) => ({
  wallet: "",

  addWallet: (wallet) => {
    set({ wallet });
  },
  getWallet: () => get().wallet,

}));

export default useStore;