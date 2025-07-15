import axios from "axios";
import { useAuthStore } from "../store/authStore.js";
import { getAuth } from "firebase/auth";

const BASE_API_URL = "http://localhost:3000/api";

export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers and handle refresh logic (firebase built-in)
// api.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().token;
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// v2
api.interceptors.request.use(
  async (config) => {
    const user = getAuth().currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
