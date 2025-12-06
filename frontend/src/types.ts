export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  self: boolean;
}

export interface LostItem {
  id: string;
  item: string;
  location: string;
  contact: string;
  type: 'LOST' | 'FOUND';
  date: string;
  image?: string | null;   // Optional (marked by ?)
  foundBy?: string | null; // Optional (marked by ?)
}