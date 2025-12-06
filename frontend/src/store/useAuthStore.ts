import { create } from 'zustand';
import { api } from '../services/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Call Real Backend
      const response = await api.post('/auth/login', { email, password });
      
      // 2. Get Data
      const { token, ...userData } = response.data;
      
      // 3. Save Token to Phone Storage (Keep user logged in)
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // 4. Update State
      set({ user: userData, token, isLoading: false });
      
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Login Failed', 
        isLoading: false 
      });
      throw err; // Let the UI know it failed
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

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));