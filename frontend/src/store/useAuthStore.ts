import { create } from 'zustand';
import { api } from '../services/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  loadUser: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isHydrated:false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, ...rest } = response.data;
      
      // SAFEY CHECK: If backend sends { token, user: {...} }, extract the inner user.
      const actualUser = rest.user ? rest.user : rest; 
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(actualUser));

      set({ user: actualUser, token, isLoading: false });
      
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login Failed', isLoading: false });
      throw err;
    }
  },


  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const { token, ...user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Signup Failed', isLoading: false });
      throw err;
    }
  },


loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isHydrated: true, // Tell the app it's safe to load
        });
      } else {
        set({ isHydrated: true });
      }
    } catch (e) {
      console.error("Storage Error (Corrupted Data):", e);
      
      // FAILSAFE: If the saved data is broken, delete it so the app doesn't freeze forever!
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      set({ user: null, token: null, isHydrated: true });
    }
  },

  

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));