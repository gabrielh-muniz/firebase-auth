import { create } from "zustand";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const useAuthStore = create((set) => {
  // Setup a listener for auth state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      set({ user, token, isAuthenticated: true });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  });

  return {
    user: null,
    isLoading: false,
    token: null,
    isAuthenticated: false,
    isCheckingAuth: false,
    error: null,

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
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },

    checkAuth: async () => {
      set({ isCheckingAuth: true });
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const token = await user.getIdToken();
            set({ user, token, isAuthenticated: true, isCheckingAuth: false });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isCheckingAuth: false,
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
        });
      } catch (error) {
        set({ isLoading: false, error: error.message });
        throw error;
      }
    },
  };
});
