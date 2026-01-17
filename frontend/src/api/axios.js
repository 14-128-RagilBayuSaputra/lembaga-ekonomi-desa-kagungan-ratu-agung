import axios from "axios";

const api = axios.create({
  // Ganti URL ini sesuai port backend Anda (misal 3000, 5000, atau 8000)
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Otomatis sisipkan Token ke setiap request jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;