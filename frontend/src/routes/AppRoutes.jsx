import { BrowserRouter, Routes, Route } from "react-router-dom";

/* USER */
import Home from "../pages/user/Home";
import Bumdes from "../pages/category/BUMDes";
import Umkm from "../pages/category/UMKM";
import Koperasi from "../pages/category/Koperasi";

/* ADMIN AUTH */
import Login from "../pages/admin/Login";
import ResetAdmin from "../pages/admin/ResetAdmin";

/* ADMIN PAGES */
import AdminHome from "../pages/admin/AdminHome"; 
import BUMDesAdmin from "../pages/admin/BUMDesAdmin";
import UMKMAdmin from "../pages/admin/UMKMAdmin";
import KoperasiAdmin from "../pages/admin/KoperasiAdmin";

/* --- HAPUS IMPORT INI KARENA KITA PAKAI MODAL --- */
// import AddProduct from "../pages/admin/AddProduct";  <-- HAPUS
// import EditProduct from "../pages/admin/EditProduct"; <-- HAPUS

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
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminHome /></PrivateRoute>} />
        
        {/* --- HAPUS ROUTE INI --- */}
        {/* <Route path="/admin/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} /> */}
        {/* <Route path="/admin/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} /> */}

        {/* Kategori Admin */}
        <Route path="/admin/bumdes" element={<PrivateRoute><BUMDesAdmin /></PrivateRoute>} />
        <Route path="/admin/umkm" element={<PrivateRoute><UMKMAdmin /></PrivateRoute>} />
        <Route path="/admin/koperasi" element={<PrivateRoute><KoperasiAdmin /></PrivateRoute>} />

      </Routes>
    </BrowserRouter>
  );
}