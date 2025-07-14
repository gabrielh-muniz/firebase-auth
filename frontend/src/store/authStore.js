import { create } from "zustand";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import axios from "axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Axios calls
const API_URL = "http://localhost:3000/api/auth";

async function fetchIsAdmin(token) {
  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.isAdmin;
  } catch {
    return false;
  }
}

export const useAuthStore = create((set) => {
  // Setup a listener for auth state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      const isAdmin = await fetchIsAdmin(token);
      set({ user, token, isAuthenticated: true, isAdmin: isAdmin });
    } else {
      set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
    }
  });

  return {
    user: null,
    isLoading: false,
    token: null,
    isAuthenticated: false,
    isCheckingAuth: false,
    error: null,
    isAdmin: false,

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const token = await user.getIdToken();
        const isAdmin = await fetchIsAdmin(token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          isAdmin: isAdmin,
        });
      } catch (error) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    // loginWithGoogle: async () => {
    //   set({ isLoading: true, error: null });
    //   try {
    //     const provider = new GoogleAuthProvider();
    //     const result = await signInWithPopup(auth, provider);
    //     const user = result.user;
    //     const token = await user.getIdToken();
    //     set({ user, token, isAuthenticated: true, isLoading: false });
    //   } catch (error) {
    //     set({ isLoading: false, error: error.message });
    //     throw error;
    //   }
    // },

    checkAuth: async () => {
      set({ isCheckingAuth: true });
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const token = await user.getIdToken();
            const isAdmin = await fetchIsAdmin(token);
            set({
              user,
              token,
              isAuthenticated: true,
              isCheckingAuth: false,
              isAdmin: isAdmin,
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isCheckingAuth: false,
              isAdmin: false,
            });
          }
          unsubscribe();
          resolve(user);
        });
      });
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await signOut(auth);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isAdmin: false,
        });
      } catch (error) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },
  };
});
