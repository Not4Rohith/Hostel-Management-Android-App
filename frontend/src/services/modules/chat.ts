import { api } from '../axiosConfig';

export const ChatService = {
  getGeneralChat: async () => {
    const res = await api.get('/chat/general');
    return res.data; // Returns array of messages with isNotice flag
  },

  getMyDMs: async (userId: string) => {
    const res = await api.get(`/chat/dms/${userId}`);
    return res.data;
  },

  sendMessage: async (content: string, senderId: string, receiverId: string | null = null, isNotice = false) => {
    const res = await api.post('/chat/send', { content, senderId, receiverId, isNotice });
    return res.data;
  }
};