import create from 'zustand';

const useUserStore = create((set) => ({
  firstName: '',
  lastName: '',
  day: '',
  month: '',
  year: '',
  email: '',
  password: '',
  userName: '',

  // Actions to update the store
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setDay: (day) => set({ day }),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setUserName: (userName) => set({ userName }),
}));

export default useUserStore;
