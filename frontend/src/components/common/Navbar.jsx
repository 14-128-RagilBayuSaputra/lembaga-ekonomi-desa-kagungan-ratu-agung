import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserLock } from "react-icons/fa";

// IMPORT LOGO BARU
import logoTiyuh from "../../assets/logo.jpeg"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => 
    location.pathname === path ? "text-green-600 font-bold" : "text-gray-600 hover:text-green-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        
        {/* === LOGO & NAMA BARU === */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo Gambar */}
          <img 
            src={logoTiyuh} 
            alt="Logo Tiyuh" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition transform"
          />
          
          {/* Teks Nama Web */}
          <div className="flex flex-col">
            <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-tight leading-none">
              LembagaEkonomi<span className="text-green-600">Tiyuh</span>
            </h1>
            <span className="text-[10px] md:text-xs text-gray-500 tracking-wide font-medium">
              Kagungan Ratu Agung
            </span>
          </div>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-sm">
          <Link to="/" className={isActive("/")}>BERANDA</Link>
          <Link to="/bumdes" className={isActive("/bumdes")}>BUMDES</Link>
          <Link to="/umkm" className={isActive("/umkm")}>UMKM</Link>
          <Link to="/koperasi" className={isActive("/koperasi")}>KOPERASI</Link>

          <button
            onClick={() => navigate("/admin/login")}
            className="px-5 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
          >
            <FaUserLock className="text-sm"/> Login Admin
          </button>
        </div>

        {/* TOMBOL HAMBURGER (Mobile) */}
        <button onClick={toggleMenu} className="md:hidden text-2xl text-gray-700 focus:outline-none p-2">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MENU MOBILE (Slide Down) */}
      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col p-4 space-y-4 font-medium text-center">
          <Link to="/" onClick={closeMenu} className={`py-2 ${isActive("/")}`}>BERANDA</Link>
          <Link to="/bumdes" onClick={closeMenu} className={`py-2 ${isActive("/bumdes")}`}>BUMDES</Link>
          <Link to="/umkm" onClick={closeMenu} className={`py-2 ${isActive("/umkm")}`}>UMKM</Link>
          <Link to="/koperasi" onClick={closeMenu} className={`py-2 ${isActive("/koperasi")}`}>KOPERASI</Link>
          
          <button
            onClick={() => { closeMenu(); navigate("/admin/login"); }}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold mt-2 shadow-md"
          >
            Login Admin
          </button>
        </div>
      </div>
    </nav>
  );
}