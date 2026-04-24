import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../lib/socket";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  // Callback passed to socket — updates onlineUsers state when server broadcasts
  _onOnlineUsers: (users) => set({ onlineUsers: users }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      connectSocket(res.data._id, get()._onOnlineUsers);
    } catch (error) {
      console.log("Not authenticated");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data.token) localStorage.setItem("wavechat_token", res.data.token);
      set({ authUser: res.data });
      toast.success("Welcome to WaveChat! 🌊");
      connectSocket(res.data._id, get()._onOnlineUsers);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res.data.token) localStorage.setItem("wavechat_token", res.data.token);
      set({ authUser: res.data });
      toast.success("Welcome back! 🌊");
      connectSocket(res.data._id, get()._onOnlineUsers);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("wavechat_token");
      set({ authUser: null, onlineUsers: [] });
      toast.success("Logged out successfully");
      disconnectSocket();
    } catch (error) {
      localStorage.removeItem("wavechat_token");
      toast.error("Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated! ✨");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));

export default useAuthStore;
