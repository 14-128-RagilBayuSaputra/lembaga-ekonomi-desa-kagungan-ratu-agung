import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar?',
      text: "Anda akan keluar dari panel admin.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Keluar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
        Swal.fire('Logout Berhasil', '', 'success');
      }
    });
  };

  const navLinks = [
    { name: "DASHBOARD", path: "/admin/dashboard" },
    { name: "KELOLA BUMTI", path: "/admin/bumdes" },
    { name: "KELOLA UMKM", path: "/admin/umkm" },
    { name: "KELOLA KOPERASI", path: "/admin/koperasi" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-3">
        
        {/* LOGO & NAMA */}
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            {/* PERBAIKAN: Langsung panggil dari folder public */}
            <img 
              src="/logo.jpeg" 
              alt="Logo Admin" 
              className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition bg-gray-50 rounded-full p-0.5" 
            />
            <div className="flex flex-col">
                <span className="font-extrabold text-lg text-gray-800 leading-tight">
                    LembagaEkonomi<span className="text-green-600">Tiyuh</span>
                </span>
                <span className="text-[10px] text-gray-500 tracking-wider">
                    Admin Dashboard
                </span>
            </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
                <Link 
                    key={link.name} 
                    to={link.path}
                    className={`text-xs font-bold tracking-wide transition-colors duration-300 ${isActive(link.path) ? "text-green-600" : "text-gray-500 hover:text-green-600"}`}
                >
                    {link.name}
                </Link>
            ))}
            
            <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-xs shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
                <FaSignOutAlt /> Logout
            </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 text-2xl focus:outline-none">
            {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 border-t" : "max-h-0"}`}>
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
                <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`block text-center py-2 font-bold text-sm ${isActive(link.path) ? "text-green-600 bg-green-50 rounded-lg" : "text-gray-600"}`}
                >
                    {link.name}
                </Link>
            ))}
            <button onClick={handleLogout} className="block w-full text-center bg-red-600 text-white py-2.5 rounded-lg font-bold text-sm shadow">
                Logout
            </button>
          </div>
      </div>
    </nav>
  );
}