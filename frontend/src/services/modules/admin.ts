import { api } from '../axiosConfig';

export const AdminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  
  getAllStudents: async () => {
    const res = await api.get('/admin/students');
    return res.data;
  },

  addStudent: async (studentData: any) => {
    const res = await api.post('/admin/add-student', studentData);
    return res.data;
  },

  updateMenu: async (day: string, menuData: any) => {
    const res = await api.post('/admin/menu', { day, ...menuData });
    return res.data;
  },
  
  // Helper to format flat student list into Room Grid for UI
  transformStudentsToRooms: (students: any[]) => {
    const roomsMap = new Map();
    // Initialize 20 rooms
    for (let i = 100; i < 120; i++) {
      roomsMap.set(String(i), { roomNo: String(i), capacity: 3, occupants: [], status: 'AVAILABLE' });
    }
    
    students.forEach(student => {
      if (student.roomNumber && roomsMap.has(student.roomNumber)) {
        const room = roomsMap.get(student.roomNumber);
        room.occupants.push(student);
        if (room.occupants.length >= 3) room.status = 'FULL';
      }
    });
    return Array.from(roomsMap.values());
  }
};