// This simulates a database response
// export const MOCK_USER_DATA = {
//   id: 'std_001',
//   name: 'Rohith',
//   email: 'rohith@college.edu',
//   phone: '+91 98765 43210',
//   course: 'B.Tech - CS (3rd Sem)',
  
//   // Hostel Info
//   roomNumber: '302',
//   block: 'A-Block',
//   bedId: 'B-1',
  
//   // Guardian Info (Critical for Hostel Apps)
//   guardianName: 'Mr. Sharma',
//   guardianPhone: '+91 99887 76655',
//   bloodGroup: 'O+',
  
//   feesPending: 5000,
//   profileImage: 'https://i.pravatar.cc/300', // Random avatar generator
  
//   complaints: [] // ... existing complaints
// };

// // A fake function that acts like an API call
// export const fetchStudentData = async () => {
//   // Simulate network delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(MOCK_USER_DATA);
//     }, 1000);
//   });
// };

// // ... existing MOCK_USER_DATA ...

// export const MOCK_COMPLAINTS = [
//   { id: 1, title: 'Fan making noise', category: 'Electrical', status: 'Pending', date: '2025-11-19' },
//   { id: 2, title: 'Bathroom tap leaking', category: 'Plumbing', status: 'Resolved', date: '2025-11-10' },
//   { id: 3, title: 'Window glass broken', category: 'Carpentry', status: 'Resolved', date: '2025-10-25' },
// ];

// // Simulate fetching complaints
// export const fetchComplaints = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve([...MOCK_COMPLAINTS]), 800);
//   });
// };

// // Simulate adding a complaint
// export const submitComplaint = async (newComplaint: any) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("Submitted to server:", newComplaint);
//       resolve(true);
//     }, 1000);
//   });
// };

// // ... existing exports

// // Change 'const' to 'let' so we can modify it
// export let MOCK_MENU: any = {
//   'Mon': {
//     Breakfast: { item: 'Idli & Vada', time: '7:30 - 9:00 AM' },
//     Lunch: { item: 'Rice, Sambar, Potato Fry', time: '12:30 - 2:00 PM' },
//     Snacks: { item: 'Tea & Biscuits', time: '4:30 - 5:30 PM' },
//     Dinner: { item: 'Chapati & Veg Curry', time: '7:30 - 9:00 PM' }
//   },
//   'Tue': {
//     Breakfast: { item: 'Dosa & Chutney', time: '7:30 - 9:00 AM' },
//     Lunch: { item: 'Lemon Rice & Curd', time: '12:30 - 2:00 PM' },
//     Snacks: { item: 'Coffee & Samosa', time: '4:30 - 5:30 PM' },
//     Dinner: { item: 'Rice & Dal Tadka', time: '7:30 - 9:00 PM' }
//   },
//   // ... keep other days
// };

// export const fetchMenu = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(MOCK_MENU), 500);
//   });
// };

// // NEW: Function to update the menu
// export const updateMenuData = async (day: string, newMenu: any) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       MOCK_MENU[day] = newMenu; // Update the local variable
//       console.log(`Updated ${day} menu:`, newMenu);
//       resolve(true);
//     }, 800);
//   });
// };
// // ... existing exports

// export const MOCK_LOST_FOUND_DATA = [
//   { id: '1', item: 'Blue Umbrella', location: 'Mess Hall', contact: 'Room 302', type: 'FOUND', date: '2025-11-18' },
//   { id: '2', item: 'Casio Calculator', location: 'Library', contact: 'Room 104', type: 'LOST', date: '2025-11-19' },
// ];

// // Simulate adding an item
// export const submitLostFoundItem = async (newItem: any) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("New Item Posted:", newItem);
//       resolve(true);
//     }, 1000);
//   });
// };



// // --- ADMIN ROOM DATA ---

// export const MOCK_ROOMS = Array.from({ length: 20 }, (_, i) => {
//   const roomNo = (100 + i).toString();
//   // Randomly fill rooms for demo
//   const filled = Math.floor(Math.random() * 4); // 0 to 3 students
//   const occupants = Array.from({ length: filled }, (_, j) => ({
//     name: `Student ${roomNo}-${j+1}`,
//     rollNo: `CS25${roomNo}${j}`,
//     bed: String.fromCharCode(65 + j), // Bed A, B, C
//     phone: '9876543210'
//   }));

//   return {
//     roomNo,
//     capacity: 3,
//     occupants, // Array of students
//     status: filled === 3 ? 'FULL' : 'AVAILABLE'
//   };
// });

// export const fetchRooms = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(MOCK_ROOMS), 500);
//   });
// };


// // --- GATE PASS DATA ---
// export const MOCK_LEAVE_REQUESTS = [
//   { id: '1', name: 'Rohith', room: '302', reason: 'Going home for weekend', from: '20 Nov', to: '22 Nov', status: 'Pending' },
//   { id: '2', name: 'Rahul', room: '104', reason: 'Sister wedding', from: '25 Nov', to: '30 Nov', status: 'Pending' },
// ];

// export const fetchLeaveRequests = async () => {
//   return new Promise((resolve) => setTimeout(() => resolve(MOCK_LEAVE_REQUESTS), 600));
// };



// export const submitLeaveRequest = async (newLeave: any) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // Add to the top of the mock list so Admin sees it
//       MOCK_LEAVE_REQUESTS.unshift(newLeave); 
//       console.log("Leave Requested:", newLeave);
//       resolve(true);
//     }, 1000);
//   });
// };


// // --- ADMIN DASHBOARD DATA ---

// export const MOCK_ADMIN_STATS = {
//   totalStudents: 142,
//   totalRooms: 50,
//   occupiedRooms: 45, // Used for the Occupancy Chart & Card
//   pendingComplaints: 5, // Used for "Issues" Card
//   pendingFees: 125000, // Used for "Due Fees" Card (125k)
  
//   // The data for the "Recent Activity" list at the bottom
//   recentActivities: [
//     { id: '1', text: 'Rohith (302) paid fees', time: '2 hrs ago', icon: 'cash' },
//     { id: '2', text: 'New Complaint: Electrical', time: '4 hrs ago', icon: 'alert-circle' },
//     { id: '3', text: 'Room 104 allocated to Rahul', time: 'Yesterday', icon: 'account-plus' },
//     { id: '4', text: 'Mess Menu updated', time: 'Yesterday', icon: 'food' },
//   ]
// };

// // The function the Dashboard calls to get this data
// export const fetchAdminStats = async () => {
//   return new Promise((resolve) => {
//     // Simulate a 0.8 second server delay so you see the loading spinner
//     setTimeout(() => resolve(MOCK_ADMIN_STATS), 800);
//   });
// };

// // --- DM / INBOX SYSTEM ---

// export interface ChatMessage {
//   id: string;
//   text: string;
//   sender: 'me' | 'other';
//   timestamp: number;
// }

// export interface ChatThread {
//   id: string; // The Roll No or ID of the other person
//   name: string;
//   avatar?: string;
//   lastMessage: string;
//   unread: number;
//   messages: ChatMessage[];
// }

// // Mock Data: Conversations the current user has
// export let MOCK_CHATS: ChatThread[] = [
//   {
//     id: 'CS2024001',
//     name: 'Rahul (Room 104)',
//     lastMessage: 'Bro, do you have the math notes?',
//     unread: 2,
//     messages: [
//        { id: '1', text: 'Hey', sender: 'me', timestamp: Date.now() - 10000 },
//        { id: '2', text: 'Bro, do you have the math notes?', sender: 'other', timestamp: Date.now() },
//     ]
//   }
// ];

// export const fetchChats = async () => {
//   return new Promise((resolve) => setTimeout(() => resolve(MOCK_CHATS), 500));
// };

// // Function to send a DM (Used by the Chat Screen)
// export const sendDM = async (chatId: string, text: string) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const chat = MOCK_CHATS.find(c => c.id === chatId);
//       if (chat) {
//         chat.messages.push({ id: Date.now().toString(), text, sender: 'me', timestamp: Date.now() });
//         chat.lastMessage = text;
//       }
//       resolve(true);
//     }, 300);
//   });
// };

// // Function to Auto-Create a DM (Used when Item is Found)
// export const autoSendFoundMessage = async (item: string, finderContact: string, ownerContact: string) => {
//   // In a real app, we'd find the owner by ID. Here we simulate creating a new chat.
//   console.log(`Auto-DM sent to ${ownerContact} from ${finderContact}`);
  
//   const newChat: ChatThread = {
//     id: ownerContact, // Assuming contact is unique ID for now
//     name: `Owner of ${item}`,
//     lastMessage: `I found your ${item}!`,
//     unread: 0,
//     messages: [
//       { id: Date.now().toString(), text: `Hey! I found your ${item}. Contact me at ${finderContact} to collect it.`, sender: 'me', timestamp: Date.now() }
//     ]
//   };
  
//   // Add to list if not exists
//   const exists = MOCK_CHATS.find(c => c.id === ownerContact);
//   if (!exists) MOCK_CHATS.unshift(newChat);
//   else {
//     exists.messages.push(newChat.messages[0]);
//     exists.lastMessage = newChat.lastMessage;
//   }
// };

// // ... existing MOCK_CHATS ...

// // List of people available to chat with
// export const MOCK_ALL_STUDENTS = [
//   { id: 'CS2024001', name: 'Rahul (Room 104)', avatar: 'Ra' },
//   { id: 'CS2024002', name: 'Amit (Room 201)', avatar: 'Am' },
//   { id: 'CS2024003', name: 'Sneha (Room 305)', avatar: 'Sn' },
//   { id: 'CS2024004', name: 'Warden', avatar: 'Wa' },
// ];


// ///////////////////////////////////////////////////////////////////////////////


import { AdminService } from './modules/admin';
import { StudentService } from './modules/student';
import { ChatService } from './modules/chat';
import { MessService } from './modules/mess';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- RE-EXPORTING SERVICES ---
export { AdminService, StudentService, ChatService, MessService };

// ====================================================================
// 1. AUTH & USER HELPERS
// ====================================================================

// Get the FULL user object (needed for Role check)
const getCurrentUser = async () => {
  const userStr = await AsyncStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get just the ID (needed for Chat)
const getCurrentUserId = async () => {
  const user = await getCurrentUser();
  return user ? user.id : null;
};

// ====================================================================
// 2. DYNAMIC FETCHES (Role Based - THE FIX)
// ====================================================================

// FIX: Check Role to decide if we fetch ALL or just MY complaints
export const fetchComplaints = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const isAdmin = user.role === 'admin';
    
    // If Admin -> true (Fetch All). If Student -> false (Fetch Mine).
    return await StudentService.getComplaints(user.id, isAdmin);
  } catch (error) {
    console.error("Fetch Complaints Error:", error);
    return [];
  }
};

// FIX: Same logic for Gate Passes
export const fetchLeaveRequests = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const isAdmin = user.role === 'admin';

    return await StudentService.getGatePasses(user.id, isAdmin);
  } catch (error) {
    console.error("Fetch Gate Pass Error:", error);
    return [];
  }
};

// ====================================================================
// 3. GENERAL CHAT
// ====================================================================
export const fetchGeneralChat = async () => {
  try {
    const messages = await ChatService.getGeneralChat();
    return messages.map((msg: any) => ({
      id: msg.id.toString(),
      text: msg.content,
      user: msg.Sender ? msg.Sender.name : 'Unknown',
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: msg.senderId,
      isNotice: msg.isNotice
    }));
  } catch (error) {
    return [];
  }
};

export const sendGeneralMessage = async (text: string) => {
  const userId = await getCurrentUserId();
  return await ChatService.sendMessage(text, userId, null, false);
};

// ====================================================================
// 4. DM / INBOX SYSTEM
// ====================================================================
const organizeDMsIntoThreads = (myId: number, rawMessages: any[]) => {
  const threadsMap = new Map();
  rawMessages.forEach(msg => {
    const isMeSender = msg.senderId === myId;
    const otherUser = isMeSender ? msg.Receiver : msg.Sender;
    if (!otherUser) return; 

    const threadId = otherUser.id.toString();
    if (!threadsMap.has(threadId)) {
      threadsMap.set(threadId, {
        id: threadId,
        name: otherUser.name,
        avatar: otherUser.name[0],
        lastMessage: msg.content,
        unread: 0,
        messages: []
      });
    }
    threadsMap.get(threadId).messages.push({
      id: msg.id.toString(),
      text: msg.content,
      sender: isMeSender ? 'me' : 'other',
      timestamp: new Date(msg.createdAt).getTime()
    });
  });
  return Array.from(threadsMap.values());
};

export const fetchChats = async () => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    const rawMessages = await ChatService.getMyDMs(userId);
    return organizeDMsIntoThreads(userId, rawMessages);
  } catch (error) {
    return [];
  }
};

export const sendDM = async (receiverId: string, text: string) => {
  const senderId = await getCurrentUserId();
  return await ChatService.sendMessage(text, senderId, receiverId, false);
};

// ====================================================================
// 5. ADMIN & MESS UTILS
// ====================================================================
export const fetchAllStudents = AdminService.getAllStudents;
export const addNewStudent = AdminService.addStudent;
export const fetchAdminStats = AdminService.getStats;

export const fetchRooms = async () => {
  const students = await AdminService.getAllStudents();
  return AdminService.transformStudentsToRooms(students);
};

export const fetchMenu = MessService.getMenu;
export const updateMenuData = AdminService.updateMenu;

// ====================================================================
// 6. SUBMIT ACTIONS
// ====================================================================
export const submitComplaint = StudentService.submitComplaint;
export const resolveComplaintAPI = StudentService.resolveComplaint;

export const submitLeaveRequest = StudentService.requestGatePass;
export const updateGatePass = StudentService.updateGatePassStatus;

export const submitLostFoundItem = StudentService.reportLostItem;
export const fetchLostItems = StudentService.getLostItems;
export const resolveLostItemAPI = StudentService.resolveLostItem;

export const sendBroadcast = async (text: string, adminId: string) => {
  return ChatService.sendMessage(text, adminId, null, true);
};

export const fetchStudentData = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) return null;
    
    const { id } = JSON.parse(userStr);
    const freshData = await StudentService.getProfile(id);
    
    return {
      ...freshData,
      course: freshData.course || 'Student', 
      profileImage: freshData.profileImage || 'https://i.pravatar.cc/300',
    };
  } catch (error) {
    return null;
  }
};