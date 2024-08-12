import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserStore = create(
  persist(
    (set, get) => ({
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: '',
      email: '',
      password: '',
      userName: '',
      authData: null,

      // Actions to update the store
      setFirstName: (firstName) => set({ firstName }),
      setLastName: (lastName) => set({ lastName }),
      setDay: (day) => set({ day }),
      setMonth: (month) => set({ month }),
      setYear: (year) => set({ year }),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setUserName: (userName) => set({ userName }),

     
    }),
    {
      name: 'user-storage', // Depolama alanında kullanılacak anahtar adı
      getStorage: () => AsyncStorage, // Eğer React Native'de AsyncStorage kullanıyorsanız
    }
  )
);

export default useUserStore;