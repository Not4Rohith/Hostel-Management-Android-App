import { api } from '../axiosConfig';

export const StudentService = {
  // --- COMPLAINTS ---
  getComplaints: async (userId?: string, isAdmin = false) => {
    // Debug Log to see what's happening
    console.log(`Fetching Complaints. Admin Mode: ${isAdmin}, UserID: ${userId}`);
    
    const url = isAdmin ? '/complaints/all' : `/complaints/my/${userId}`;
    const res = await api.get(url);
    return res.data;
  },
  
  submitComplaint: async (data: any) => {
    return await api.post('/complaints', data);
  },

  resolveComplaint: async (id: string) => {
    return await api.put(`/complaints/${id}/resolve`);
  },

  // ... (Keep existing Gate Pass / Lost Found / Profile functions below) ...
  // (Copy paste the rest of your existing functions for GatePass/LostFound here so you don't lose them)
  // Gate Pass
  getGatePasses: async (userId?: string, isAdmin = false) => {
    const url = isAdmin ? '/gatepass/all' : `/gatepass/my/${userId}`;
    const res = await api.get(url);
    return res.data;
  },

  requestGatePass: async (data: any) => {
    return await api.post('/gatepass', data);
  },

  updateGatePassStatus: async (id: string, status: string) => {
    return await api.put(`/gatepass/${id}`, { status });
  },

  // Lost & Found
  getLostItems: async () => {
    const res = await api.get('/lostfound');
    return res.data;
  },

  reportLostItem: async (data: any) => {
    const formData = new FormData();
    formData.append('item', data.item);
    formData.append('location', data.location);
    formData.append('contact', data.contact);
    formData.append('type', data.type);
    formData.append('reportedBy', data.reportedBy); 

    if (data.image) {
      formData.append('image', {
        uri: data.image,
        name: 'upload.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const res = await api.post('/lostfound', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  
  resolveLostItem: async (id: string, foundByContact: string) => {
    return await api.put(`/lostfound/${id}/resolve`, { foundByContact });
  },

  getProfile: async (userId: string) => {
    const res = await api.get(`/auth/me/${userId}`);
    return res.data;
  },
};