import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/user/Home";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../components/admin/AdminLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}