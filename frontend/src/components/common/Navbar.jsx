import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
      ? "text-green-600 font-semibold"
      : "hover:text-green-600";

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <h1
          onClick={() => goTo("/")}
          className="font-bold text-green-600 cursor-pointer text-lg"
        >
          Lembaga Ekonomi Desa
        </h1>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex space-x-6 items-center font-medium">
          <li
            onClick={() => goTo("/")}
            className={`cursor-pointer ${isActive("/")}`}
          >
            Beranda
          </li>

          <li
            onClick={() => goTo("/bumdes")}
            className={`cursor-pointer ${isActive("/bumdes")}`}
          >
            BUMDes
          </li>

          <li
            onClick={() => goTo("/umkm")}
            className={`cursor-pointer ${isActive("/umkm")}`}
          >
            UMKM
          </li>

          <li
            onClick={() => goTo("/koperasi")}
            className={`cursor-pointer ${isActive("/koperasi")}`}
          >
            Koperasi
          </li>

          {/* LOGIN ADMIN */}
          <button
            onClick={() => goTo("/admin/login")}
            className="ml-4 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Login Admin
          </button>
        </ul>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4 text-sm font-medium">
          <div
            onClick={() => goTo("/")}
            className="cursor-pointer hover:text-green-600"
          >
            Beranda
          </div>

          <div
            onClick={() => goTo("/bumdes")}
            className="cursor-pointer hover:text-green-600"
          >
            BUMDes
          </div>

          <div
            onClick={() => goTo("/umkm")}
            className="cursor-pointer hover:text-green-600"
          >
            UMKM
          </div>

          <div
            onClick={() => goTo("/koperasi")}
            className="cursor-pointer hover:text-green-600"
          >
            Koperasi
          </div>

          <button
            onClick={() => goTo("/admin/login")}
            className="w-full border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Login Admin
          </button>
        </div>
      )}
    </nav>
  );
}
