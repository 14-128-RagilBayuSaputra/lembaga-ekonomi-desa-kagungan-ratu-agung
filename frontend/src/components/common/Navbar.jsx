import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Efek Scroll (Ubah background & warna teks)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "BERANDA", path: "/" },
    { name: "BUMTI", path: "/bumdes" },
    { name: "UMKM", path: "/umkm" },
    { name: "KOPERASI", path: "/koperasi" },
  ];

  const isActive = (path) => location.pathname === path;

  // LOGIKA WARNA TEKS
  // Jika di scroll: Teks Abu-abu (Background Putih)
  // Jika di atas: Teks Putih (Background Transparan/Gelap)
  const textColor = scrolled ? "text-gray-700" : "text-white";
  const hoverColor = scrolled ? "hover:text-green-600" : "hover:text-green-300";
  const activeColor = scrolled ? "text-green-600" : "text-green-300 font-extrabold";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-black/20 backdrop-blur-[2px] py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        
        {/* LOGO & NAMA */}
        <Link to="/" className="flex items-center gap-3 group">
            {/* Pastikan file 'logo.jpeg' ada di folder PUBLIC */}
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition bg-white rounded-full p-0.5" />
            
            <div className="flex flex-col">
                <span className={`font-extrabold text-lg leading-tight transition-colors ${scrolled ? "text-gray-800" : "text-white drop-shadow-md"}`}>
                    LembagaEkonomi<span className={scrolled ? "text-green-600" : "text-green-400"}>Tiyuh</span>
                </span>
                <span className={`text-[10px] tracking-wider ${scrolled ? "text-gray-500" : "text-gray-200"}`}>
                    Kagungan Ratu Agung
                </span>
            </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link 
                    key={link.name} 
                    to={link.path}
                    className={`text-sm font-bold tracking-wide transition-colors duration-300 relative group ${isActive(link.path) ? activeColor : `${textColor} ${hoverColor}`}`}
                >
                    {link.name}
                    {/* Garis Bawah Animasi */}
                    <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${scrolled ? "bg-green-600" : "bg-green-400"} ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </Link>
            ))}
            
            <Link to="/login" className={`${scrolled ? "bg-green-600 hover:bg-green-700" : "bg-white/20 hover:bg-white/30 border border-white/50 backdrop-blur-md"} text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2`}>
                <FaUserCircle /> Login Admin
            </Link>
        </div>

        {/* MOBILE TOGGLE (HAMBURGER) */}
        <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden text-2xl focus:outline-none ${scrolled ? "text-gray-700" : "text-white"}`}>
            {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU (Tetap Putih agar terbaca) */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 border-t" : "max-h-0"}`}>
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
                <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`block text-center py-2 font-bold ${isActive(link.path) ? "text-green-600 bg-green-50 rounded-lg" : "text-gray-600"}`}
                >
                    {link.name}
                </Link>
            ))}
            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center bg-green-600 text-white py-2.5 rounded-lg font-bold shadow">
                Login Admin
            </Link>
          </div>
      </div>
    </nav>
  );
}