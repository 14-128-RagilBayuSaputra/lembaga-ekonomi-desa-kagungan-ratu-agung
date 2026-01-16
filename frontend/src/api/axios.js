import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 1. INTERCEPTOR REQUEST: Otomatis kirim token admin
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

// 2. INTERCEPTOR RESPONSE: Otomatis Logout jika Sesi Habis (401)
api.interceptors.response.use(
  (response) => {
    // Jika respon sukses, teruskan saja
    return response;
  },
  (error) => {
    // Jika respon error dan statusnya 401 (Unauthorized / Token Tidak Valid)
    if (error.response && error.response.status === 401) {
      
      // A. Hapus token yang sudah kadaluarsa
      localStorage.removeItem("admin_token");

      // B. Cek apakah user sedang berada di halaman admin
      // Kita pakai window.location agar halaman ter-refresh bersih
      if (window.location.pathname.startsWith("/admin")) {
        // Jangan redirect jika sudah di halaman login (biar ga looping)
        if (window.location.pathname !== "/admin/login") {
            window.location.href = "/admin/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;