import { NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `cursor-pointer transition ${
      isActive
        ? "text-green-600 font-semibold"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* LOGO / TITLE */}
        <h1
          onClick={() => navigate("/admin/dashboard")}
          className="font-bold text-green-600 cursor-pointer text-lg"
        >
          Admin Desa
        </h1>

        {/* MENU */}
        <div className="flex items-center gap-6 font-medium">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Beranda
          </NavLink>

          <NavLink to="/admin/bumdes" className={linkClass}>
            BUMDes
          </NavLink>

          <NavLink to="/admin/umkm" className={linkClass}>
            UMKM
          </NavLink>

          <NavLink to="/admin/koperasi" className={linkClass}>
            Koperasi
          </NavLink>

          <button
            onClick={logout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
