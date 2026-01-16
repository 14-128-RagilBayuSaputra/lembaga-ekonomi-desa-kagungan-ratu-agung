import { BrowserRouter, Routes, Route } from "react-router-dom";

/* USER */
import Home from "../pages/user/Home";

/* CATEGORY */
import Bumdes from "../pages/category/BUMDes";
import Umkm from "../pages/category/UMKM";
import Koperasi from "../pages/category/Koperasi";

/* ADMIN AUTH */
import Login from "../pages/admin/Login";
import ResetAdmin from "../pages/admin/ResetAdmin";

/* ADMIN PAGES */
import BUMDesAdmin from "../pages/admin/BUMDesAdmin";
import UMKMAdmin from "../pages/admin/UMKMAdmin";
import KoperasiAdmin from "../pages/admin/KoperasiAdmin";
import AdminHome from "../pages/admin/AdminHome"; 

/* PENTING: IMPORT PRIVATE ROUTE */
// Pastikan file ini ada. Jika belum, lihat kode di bawah.
import PrivateRoute from "../components/auth/PrivateRoute"; 

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === USER ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/bumdes" element={<Bumdes />} />
        <Route path="/umkm" element={<Umkm />} />
        <Route path="/koperasi" element={<Koperasi />} />

        {/* === ADMIN AUTH === */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/reset" element={<ResetAdmin />} />

        {/* === ADMIN PAGES === */}
        {/* CATATAN PENTING:
            Kita MEMBUNGKUS dengan <PrivateRoute> agar aman.
            Kita TIDAK MEMBUNGKUS dengan <AdminLayout> agar tampilan Full Width
            (Karena AdminNavbar sudah ada di dalam masing-masing halaman).
        */}
        
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          } 
        />

        <Route
          path="/admin/bumdes"
          element={
            <PrivateRoute>
               <BUMDesAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/umkm"
          element={
            <PrivateRoute>
               <UMKMAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/koperasi"
          element={
            <PrivateRoute>
               <KoperasiAdmin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}