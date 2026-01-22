import { Link } from "react-router-dom";
import { 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaEnvelope, 
  FaInstagram, 
  FaFacebook, 
  FaYoutube, 
  FaTiktok, 
  FaChevronRight, 
  FaGlobe 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-green-600 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* KOLOM 1: IDENTITAS PEMERINTAH */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                {/* Logo Desa */}
                <img src="/logo.jpeg" alt="Logo Tiyuh" className="w-14 h-14 object-contain bg-white rounded-full p-1" />
                <div className="flex flex-col">
                    <span className="font-extrabold text-lg text-white leading-tight">
                        Pemerintah Tiyuh
                    </span>
                    <span className="text-sm font-bold text-green-500 tracking-wide uppercase">
                        Kagungan Ratu Agung
                    </span>
                </div>
            </div>
            
            <div className="text-sm leading-relaxed text-gray-400 mt-4 space-y-2">
                <p className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-green-500 mt-1 shrink-0" />
                    <span>
                        Jl. Jalur Dua Tiyuh Kagungan Ratu Agung Rt.004 Rw.002, 
                        Kec. Tulang Bawang Udik, Kab. Tulang Bawang Barat, 
                        Provinsi Lampung, 34791.
                    </span>
                </p>
                <p className="flex items-center gap-2">
                    <FaGlobe className="text-green-500 shrink-0" />
                    <span>Kode Wilayah: <b>18.12.03.2010</b></span>
                </p>
            </div>
          </div>

          {/* KOLOM 2: NAVIGASI WEBSITE */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 relative">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span> Jelajahi
            </h3>
            <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-green-400 flex items-center gap-2 transition"><FaChevronRight size={10} className="text-green-600"/> Beranda</Link></li>
                <li><Link to="/bumdes" className="hover:text-green-400 flex items-center gap-2 transition"><FaChevronRight size={10} className="text-green-600"/> Produk BUMTI</Link></li>
                <li><Link to="/koperasi" className="hover:text-green-400 flex items-center gap-2 transition"><FaChevronRight size={10} className="text-green-600"/> Produk Koperasi</Link></li>
                <li><Link to="/umkm" className="hover:text-green-400 flex items-center gap-2 transition"><FaChevronRight size={10} className="text-green-600"/> Produk UMKM</Link></li>
                <li><Link to="/login" className="hover:text-green-400 flex items-center gap-2 transition"><FaChevronRight size={10} className="text-green-600"/> Login Admin</Link></li>
            </ul>
          </div>

          {/* KOLOM 3: KONTAK */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 relative">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span> Hubungi Kami
            </h3>
            <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-green-500 transition">
                    <div className="bg-green-600 p-2 rounded-full text-white">
                        <FaWhatsapp size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">WhatsApp Pelayanan</span>
                        <a href="https://wa.me/6282282200300" target="_blank" rel="noreferrer" className="text-white font-bold hover:text-green-400">
                            0822-8220-0300
                        </a>
                    </div>
                </li>
                <li className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-green-500 transition">
                    <div className="bg-blue-600 p-2 rounded-full text-white">
                        <FaEnvelope size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Email Resmi</span>
                        <a href="mailto:kagunganratuagung@gmail.com" className="text-white font-bold hover:text-blue-400 break-all">
                            kagunganratuagung@gmail.com
                        </a>
                    </div>
                </li>
            </ul>
          </div>

          {/* KOLOM 4: MEDIA SOSIAL */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 relative">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span> Ikuti Kami
            </h3>
            <p className="text-xs text-gray-400 mb-4">
                Dapatkan informasi terbaru mengenai kegiatan dan potensi Tiyuh melalui media sosial resmi kami.
            </p>
            <div className="grid grid-cols-4 gap-2">
                {/* Facebook */}
                <a 
                    href="https://www.facebook.com/share/185Zikh72j/" 
                    target="_blank" rel="noreferrer"
                    className="h-10 w-10 bg-[#1877F2] rounded-lg flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    title="Facebook"
                >
                    <FaFacebook size={20} />
                </a>

                {/* Instagram */}
                <a 
                    href="https://www.instagram.com/kagungan_ratu_agung?igsh=MWY5cDF2NmR6dHU4Ng==" 
                    target="_blank" rel="noreferrer"
                    className="h-10 w-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    title="Instagram"
                >
                    <FaInstagram size={20} />
                </a>

                {/* TikTok */}
                <a 
                    href="https://www.tiktok.com/@kagunganratuagung?_r=1&_t=ZS-93EUPkpLUyD" 
                    target="_blank" rel="noreferrer"
                    className="h-10 w-10 bg-black border border-gray-700 rounded-lg flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    title="TikTok"
                >
                    <FaTiktok size={18} />
                </a>

                {/* YouTube */}
                <a 
                    href="https://www.youtube.com/results?search_query=TIYUH+KAGUNGAN+RATU+AGUNG" 
                    target="_blank" rel="noreferrer"
                    className="h-10 w-10 bg-[#FF0000] rounded-lg flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    title="YouTube"
                >
                    <FaYoutube size={20} />
                </a>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} <span className="text-green-500 font-bold">Lembaga Ekonomi Tiyuh</span> Kagungan Ratu Agung.
            </p>
            <p className="text-[10px] text-gray-600">
                Powered by React & Digital Desa Indonesia
            </p>
        </div>
      </div>
    </footer>
  );
}