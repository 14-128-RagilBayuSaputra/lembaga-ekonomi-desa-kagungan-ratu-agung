import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

import logoTiyuh from "../../assets/logo.jpeg"; 

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar dari Admin?")) {
      localStorage.removeItem("admin_token");
      navigate("/admin/login");
    }
  };

  const isActive = (path) => 
    location.pathname === path ? "text-green-600 font-bold" : "text-gray-600 hover:text-green-600";

  return (
    <>
      {/* BACKDROP BLUR */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={closeMenu}
        ></div>
      )}

      <nav className="bg-white shadow-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center bg-white relative z-50">
          
          {/* LOGO */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img 
              src={logoTiyuh} 
              alt="Logo Tiyuh" 
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="font-bold text-base md:text-lg lg:text-xl text-gray-800 tracking-tight leading-none">
                LembagaEkonomi<span className="text-green-600">Tiyuh</span>
              </h1>
              <span className="text-[10px] md:text-xs text-gray-500 tracking-wide font-medium">
                Admin Dashboard
              </span>
            </div>
          </div>

          {/* MENU DESKTOP (Hanya di LG ke atas) */}
          <div className="hidden lg:flex items-center space-x-6 font-medium text-sm">
            <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>DASHBOARD</Link>
            <Link to="/admin/bumdes" className={isActive("/admin/bumdes")}>KELOLA BUMDES</Link>
            <Link to="/admin/umkm" className={isActive("/admin/umkm")}>KELOLA UMKM</Link>
            <Link to="/admin/koperasi" className={isActive("/admin/koperasi")}>KELOLA KOPERASI</Link>

            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
            >
              <FaSignOutAlt className="text-sm"/> Logout
            </button>
          </div>

          {/* HAMBURGER (Muncul di Mobile & Tablet) */}
          <button onClick={toggleMenu} className="lg:hidden text-2xl text-gray-700 focus:outline-none p-2">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* MENU MOBILE/TABLET */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out z-40 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="flex flex-col p-6 space-y-4 font-medium text-center">
            <Link to="/admin/dashboard" onClick={closeMenu} className={`py-2 ${isActive("/admin/dashboard")}`}>DASHBOARD</Link>
            <Link to="/admin/bumdes" onClick={closeMenu} className={`py-2 ${isActive("/admin/bumdes")}`}>BUMDES</Link>
            <Link to="/admin/umkm" onClick={closeMenu} className={`py-2 ${isActive("/admin/umkm")}`}>UMKM</Link>
            <Link to="/admin/koperasi" onClick={closeMenu} className={`py-2 ${isActive("/admin/koperasi")}`}>KOPERASI</Link>
            
            <div className="pt-2 border-t border-gray-100 mt-2">
                <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
                >
                <FaSignOutAlt /> Logout
                </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}