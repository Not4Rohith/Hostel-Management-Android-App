import { api } from '../axiosConfig';

export const MessService = {
  getMenu: async () => {
    try {
      const res = await api.get('/mess');
      return res.data;
    } catch (error) {
      console.error("Mess Fetch Error:", error);
      return {};
    }
  },

  // Now we expect 'menuData' to already have lowercase keys from the UI
  updateMenu: async (day: string, menuData: any) => {
    const payload = {
      day,
      ...menuData // Spread the lowercase keys directly
    };

    console.log("Service Sending:", payload);
    const res = await api.post('/mess/update', payload);
    return res.data;
  }
};