import { useEffect, useState } from "react";
import { FaStore, FaHandshake, FaBullhorn, FaArrowRight, FaWhatsapp, FaCamera, FaIdCard, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";
import SkeletonCard from "../../components/ui/SkeletonCard"; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        setProducts((res.data.data || []).slice(0, 8));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      <HeroSlider isAdmin={false} isHomePage={true} />

      {/* === SEKSI KATEGORI === */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <span className="text-green-600 font-bold tracking-wider text-xs md:text-sm mb-2 block uppercase">Potensi Desa</span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Membangun Ekonomi Desa Digital</h2>
            <p className="max-w-3xl mx-auto text-gray-500 mb-8 md:mb-12 text-sm md:text-base leading-relaxed">
               Wadah resmi promosi potensi ekonomi Desa Kagungan Ratu Agung. Integrasi BUMDes, UMKM, dan Koperasi dalam satu platform digital.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <div onClick={() => navigate("/bumdes")} className="group p-6 bg-green-50 rounded-2xl hover:bg-green-600 transition duration-300 cursor-pointer border border-green-100 shadow-sm">
                    <FaStore className="text-4xl text-green-600 group-hover:text-white mx-auto mb-3 transition" />
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-white">BUMDes</h3>
                    <p className="text-xs text-gray-500 group-hover:text-green-100 mt-1">Pendapatan asli desa.</p>
                </div>
                <div onClick={() => navigate("/koperasi")} className="group p-6 bg-green-50 rounded-2xl hover:bg-green-600 transition duration-300 cursor-pointer border border-green-100 shadow-sm">
                    <FaHandshake className="text-4xl text-green-600 group-hover:text-white mx-auto mb-3 transition" />
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-white">Koperasi</h3>
                    <p className="text-xs text-gray-500 group-hover:text-green-100 mt-1">Kesejahteraan anggota.</p>
                </div>
                <div onClick={() => navigate("/umkm")} className="group p-6 bg-green-50 rounded-2xl hover:bg-green-600 transition duration-300 cursor-pointer border border-green-100 shadow-sm">
                    <FaBullhorn className="text-4xl text-green-600 group-hover:text-white mx-auto mb-3 transition" />
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-white">UMKM</h3>
                    <p className="text-xs text-gray-500 group-hover:text-green-100 mt-1">Usaha kreatif warga.</p>
                </div>
            </div>
        </div>
      </section>

      {/* === LANGKAH PENDAFTARAN (REVISI: Dibuat Per Poin/Grid) === */}
      <section className="py-12 md:py-16 bg-green-600 text-white px-4 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-20 -translate-y-20 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 translate-y-20 blur-2xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Ingin Produk Anda Tampil Disini?</h2>
            
            {/* GRID LANGKAH-LANGKAH */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left md:text-center">
                
                {/* Langkah 1 */}
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg">
                        1
                    </div>
                    <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                        <FaIdCard /> Siapkan Data
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                        Siapkan KTP, Nama Usaha, dan Deskripsi produk Anda. Pastikan data diri sesuai dengan domisili desa.
                    </p>
                </div>

                {/* Langkah 2 */}
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg">
                        2
                    </div>
                    <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                        <FaCamera /> Foto Produk
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                        Ambil foto produk yang jelas dan menarik. Pencahayaan yang baik membuat produk lebih diminati pembeli.
                    </p>
                </div>

                {/* Langkah 3 */}
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto shadow-lg">
                        3
                    </div>
                    <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                        <FaCheckCircle /> Hubungi Admin
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                        Kirimkan data dan foto ke WhatsApp Admin Desa. Kami akan memproses dan menayangkan produk Anda.
                    </p>
                </div>
            </div>

            <button 
                onClick={() => window.open("https://wa.me/6281234567890", "_blank")} 
                className="bg-white text-green-600 px-8 py-3.5 rounded-full font-bold shadow-xl hover:bg-gray-100 transition transform hover:scale-105 flex items-center gap-2 mx-auto text-sm md:text-base animate-bounce-slow"
            >
                <FaWhatsapp className="text-xl"/> Daftar Sekarang via WhatsApp
            </button>
        </div>
      </section>

      {/* === SEKSI PRODUK TERBARU === */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-green-600 pl-4">
            Produk Terbaru
        </h2>

        {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                 {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
             </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((item) => (
                <ProductCard
                    key={item.id}
                    product={item}
                    isAdmin={false}
                    onClick={() => setSelectedProduct(item)}
                />
            ))}
            </div>
        )}
      </section>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}