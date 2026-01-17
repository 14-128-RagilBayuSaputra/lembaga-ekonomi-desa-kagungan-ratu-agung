import { useEffect, useState } from "react";
import { FaStore, FaHandshake, FaBullhorn, FaArrowRight, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

// COMPONENTS
import NavbarAdmin from "../../components/admin/NavbarAdmin"; 
import HeroSlider from "../../components/common/HeroSlider"; 
import ProductDetailModal from "../../components/ui/ProductDetailModal"; 

export default function AdminHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    // 1. BACKGROUND GRADIENT (Putih ke Hijau Muda Halus)
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 font-sans text-gray-800 pb-20">
      
      <NavbarAdmin />

      {/* 2. SLIDER */}
      <div className="relative">
        <HeroSlider isAdmin={true} isHomePage={true} />
        
        {/* 3. FLOATING CARD (KOTAK MENGAMBANG) */}
        {/* -mt-16 artinya kotak ini naik ke atas menutupi sebagian slider */}
        <div className="max-w-6xl mx-auto px-4 relative z-10 -mt-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-600 rounded-full mb-4 shadow-sm">
                    <FaChartLine className="text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                    Panel Admin <span className="text-green-600">Terpadu</span>
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-5 rounded-full"></div>
                <p className="max-w-3xl mx-auto text-gray-500 text-base leading-relaxed">
                   Selamat datang di pusat kendali Lembaga Ekonomi Tiyuh. Kelola potensi <b>BUMDes, UMKM, dan Koperasi</b> secara efisien. 
                   Pastikan data selalu diperbarui untuk transparansi dan promosi yang maksimal.
                </p>
            </div>
        </div>
      </div>

      {/* 4. SHORTCUT KATEGORI (Cards dengan Hover Effect) */}
      <section className="py-12 max-w-7xl mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card BUMDes */}
            <div 
                onClick={() => navigate("/admin/bumdes")}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center cursor-pointer group hover:-translate-y-2 hover:shadow-xl transition duration-300"
            >
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-green-600 group-hover:text-white transition duration-300">
                    <FaStore />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-1">Kelola BUMDes</h3>
                <p className="text-sm text-gray-400 mb-4">Pendapatan Asli Desa</p>
                <span className="text-green-600 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Buka Halaman <FaArrowRight />
                </span>
            </div>

            {/* Card Koperasi */}
            <div 
                onClick={() => navigate("/admin/koperasi")}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center cursor-pointer group hover:-translate-y-2 hover:shadow-xl transition duration-300"
            >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                    <FaHandshake />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-1">Kelola Koperasi</h3>
                <p className="text-sm text-gray-400 mb-4">Kesejahteraan Anggota</p>
                <span className="text-blue-600 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Buka Halaman <FaArrowRight />
                </span>
            </div>

            {/* Card UMKM */}
            <div 
                onClick={() => navigate("/admin/umkm")}
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center cursor-pointer group hover:-translate-y-2 hover:shadow-xl transition duration-300"
            >
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                    <FaBullhorn />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-1">Kelola UMKM</h3>
                <p className="text-sm text-gray-400 mb-4">Ekonomi Kreatif Warga</p>
                <span className="text-orange-600 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Buka Halaman <FaArrowRight />
                </span>
            </div>
         </div>
      </section>

      {/* 5. PREVIEW PRODUK */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1.5 bg-green-600 rounded-full"></div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Preview Produk</h2>
                <p className="text-sm text-gray-500">Tampilan produk terkini di mata pengunjung.</p>
            </div>
        </div>

        {loading ? (
             <div className="text-center py-12 text-gray-400 bg-white rounded-xl shadow-sm">Memuat data...</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer group"
                    onClick={() => setSelectedProduct(item)} 
                >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-[10px] font-bold text-gray-700 shadow-md">
                            {item.category?.name}
                        </div>
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-gray-800 text-base line-clamp-1 mb-1 group-hover:text-green-600 transition">{item.product_name}</h3>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                            <FaStore className="text-gray-300"/> {item.business_name}
                        </p>
                    </div>
                </div>
            ))}
            </div>
        )}
      </section>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}