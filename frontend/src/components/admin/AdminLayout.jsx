import { Navigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
