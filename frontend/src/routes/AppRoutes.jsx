import { BrowserRouter, Routes, Route } from "react-router-dom";

/* USER */
import Home from "../pages/user/Home";

/* CATEGORY */
import Bumdes from "../pages/category/BUMDes";
import Umkm from "../pages/category/UMKM";
import Koperasi from "../pages/category/Koperasi";

/* ADMIN */
import Login from "../pages/admin/Login";
import ResetAdmin from "../pages/admin/ResetAdmin";
import Dashboard from "../pages/admin/Dashboard";
import BUMDesAdmin from "../pages/admin/BUMDesAdmin";
import UMKMAdmin from "../pages/admin/UMKMAdmin";
import KoperasiAdmin from "../pages/admin/KoperasiAdmin";


/* ADMIN LAYOUT */
import AdminLayout from "../components/admin/AdminLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />
        <Route path="/bumdes" element={<Bumdes />} />
        <Route path="/umkm" element={<Umkm />} />
        <Route path="/koperasi" element={<Koperasi />} />

        {/* ADMIN AUTH */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/reset" element={<ResetAdmin />} />
        <Route
        path="/admin/bumdes"
        element={
       <AdminLayout>
       <BUMDesAdmin />
      </AdminLayout>
      }
      />

<Route
  path="/admin/umkm"
  element={
    <AdminLayout>
      <UMKMAdmin />
    </AdminLayout>
  }
/>

<Route
  path="/admin/koperasi"
  element={
    <AdminLayout>
      <KoperasiAdmin />
    </AdminLayout>
  }
/>


        {/* ADMIN DASHBOARD (PROTECTED) */}
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
