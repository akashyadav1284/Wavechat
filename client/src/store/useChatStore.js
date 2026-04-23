import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../lib/socket";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: {},
  searchResults: [],
  isSearching: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data });
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }
    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/users/search?q=${query}`);
      set({ searchResults: res.data });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      set({ isSearching: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error("Failed to send message");
    }
  },

  markAsSeen: async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);
    } catch (error) {
      console.error("Mark as seen failed:", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (isFromSelectedUser) {
        set({ messages: [...get().messages, newMessage] });
        // Mark as seen
        get().markAsSeen(selectedUser._id);
      }
    });

    socket.on("messagesSeen", ({ from }) => {
      if (from === selectedUser._id) {
        set({
          messages: get().messages.map((msg) => ({
            ...msg,
            seen: true,
          })),
        });
      }
    });

    socket.on("userTyping", ({ from }) => {
      if (from === selectedUser._id) {
        set({
          typingUsers: { ...get().typingUsers, [from]: true },
        });
      }
    });

    socket.on("userStopTyping", ({ from }) => {
      if (from === selectedUser._id) {
        const updated = { ...get().typingUsers };
        delete updated[from];
        set({ typingUsers: updated });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messagesSeen");
    socket.off("userTyping");
    socket.off("userStopTyping");
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user, searchResults: [] });
  },

  clearSearch: () => {
    set({ searchResults: [], isSearching: false });
  },
}));

export default useChatStore;
