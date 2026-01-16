import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // Cek token admin (sesuai dengan yang Anda pakai di Login/AdminNavbar)
  const token = localStorage.getItem("admin_token"); 

  if (!token) {
    // Jika tidak ada token (belum login), paksa kembali ke halaman Login
    return <Navigate to="/admin/login" replace />;
  }

  // Jika ada token, izinkan masuk
  return children ? children : <Outlet />;
}