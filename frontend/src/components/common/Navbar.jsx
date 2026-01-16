import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserLock } from "react-icons/fa"; // Pastikan install react-icons

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-desa-primary font-bold border-b-2 border-desa-primary"
      : "text-gray-600 hover:text-desa-primary transition-colors duration-300";

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <div onClick={() => goTo("/")} className="flex items-center gap-2 cursor-pointer group">
            {/* Opsional: Tambahkan logo desa disini jika ada */}
            <h1 className="font-bold text-2xl text-desa-primary tracking-tight group-hover:text-desa-dark transition">
              Ekonomi<span className="text-gray-800">Desa</span>
            </h1>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex space-x-8 items-center font-medium text-sm tracking-wide">
          {["/", "/bumdes", "/umkm", "/koperasi"].map((path) => (
            <li
              key={path}
              onClick={() => goTo(path)}
              className={`cursor-pointer py-1 ${isActive(path)}`}
            >
              {path === "/" ? "BERANDA" : path.replace("/", "").toUpperCase()}
            </li>
          ))}

          {/* LOGIN ADMIN BUTTON */}
          <button
            onClick={() => goTo("/admin/login")}
            className="ml-6 px-5 py-2 bg-desa-primary text-white rounded-full font-semibold hover:bg-desa-dark hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <FaUserLock className="text-sm"/> Admin Login
          </button>
        </ul>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${open ? "max-h-screen py-4 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col space-y-2 px-4">
          {["/", "/bumdes", "/umkm", "/koperasi"].map((path) => (
             <div key={path} onClick={() => goTo(path)} className={`p-3 rounded-lg ${location.pathname === path ? 'bg-desa-light text-desa-primary font-bold' : 'text-gray-600'}`}>
                {path === "/" ? "Beranda" : path.replace("/", "").toUpperCase()}
             </div>
          ))}
          <button
            onClick={() => goTo("/admin/login")}
            className="mt-4 w-full bg-desa-primary text-white py-3 rounded-lg font-bold shadow-md active:scale-95 transition"
          >
            Login Admin Area
          </button>
        </div>
      </div>
    </nav>
  );
}