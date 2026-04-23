import axios from "axios";

// In dev: Vite proxy forwards /api → localhost:5000
// In prod: VITE_BACKEND_URL points to your Render/Railway backend
const baseURL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : "/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
