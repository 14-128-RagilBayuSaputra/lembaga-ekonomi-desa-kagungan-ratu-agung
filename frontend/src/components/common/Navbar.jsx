import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="font-bold text-green-600 cursor-pointer"
        >
          Lembaga Ekonomi Desa
        </h1>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li className="hover:text-green-600 cursor-pointer">BUMDes</li>
          <li className="hover:text-green-600 cursor-pointer">UMKM</li>
          <li className="hover:text-green-600 cursor-pointer">Koperasi</li>

          {/* LOGIN ADMIN */}
          <button
            onClick={() => navigate("/admin/login")}
            className="ml-4 px-4 py-1 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition"
          >
            Login Admin
          </button>
        </ul>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <div>BUMDes</div>
          <div>UMKM</div>
          <div>Koperasi</div>

          <button
            onClick={() => navigate("/admin/login")}
            className="w-full border border-green-600 text-green-600 py-2 rounded"
          >
            Login Admin
          </button>
        </div>
      )}
    </nav>
  );
}
