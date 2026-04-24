import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : "/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach JWT from localStorage on every request (cross-origin Bearer token auth)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("wavechat_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
