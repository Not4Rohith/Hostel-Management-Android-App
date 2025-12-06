import axios from 'axios';

// REPLACE THIS WITH YOUR IP ADDRESS 
const BASE_URL = 'http://192.168.31.76:5000/api'; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Log errors easily
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);