import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* USER PAGES */
import Home from "../pages/user/Home";
import Bumdes from "../pages/category/Bumdes";
import Umkm from "../pages/category/Umkm";
import Koperasi from "../pages/category/Koperasi";

/* ADMIN AUTH */
import Login from "../pages/admin/Login";
import ResetAdmin from "../pages/admin/ResetAdmin";

/* ADMIN PAGES */
import AdminHome from "../pages/admin/AdminHome"; 
import AdminProductManager from "../components/admin/AdminProductManager";
import PrivateRoute from "../components/auth/PrivateRoute"; 

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* === USER ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/bumdes" element={<Bumdes />} />
        <Route path="/umkm" element={<Umkm />} />
        <Route path="/koperasi" element={<Koperasi />} />

        {/* === ADMIN AUTH === */}
        {/* Login di /login agar sesuai dengan Navbar */}
        <Route path="/login" element={<Login />} />
        
        {/* INI KUNCINYA: Daftarkan rute /admin/reset agar tombol 'Lupa Password' bekerja */}
        <Route path="/admin/reset" element={<ResetAdmin />} />

        {/* === ADMIN PAGES (DILINDUNGI) === */}
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminHome /></PrivateRoute>} />
        
        <Route path="/admin/bumdes" element={
            <PrivateRoute>
                <AdminProductManager title="BUMTI" categoryId={1} description="Kelola unit usaha BUMTI." />
            </PrivateRoute>
        } />

        <Route path="/admin/umkm" element={
            <PrivateRoute>
                <AdminProductManager title="UMKM" categoryId={3} description="Kelola usaha kreatif warga." />
            </PrivateRoute>
        } />

        <Route path="/admin/koperasi" element={
            <PrivateRoute>
                <AdminProductManager title="Koperasi" categoryId={2} description="Kelola layanan koperasi." />
            </PrivateRoute>
        } />

        {/* Catch-all: Jika halaman tidak ada, kembali ke Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}