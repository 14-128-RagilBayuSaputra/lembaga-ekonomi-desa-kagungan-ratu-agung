import { useEffect, useState } from "react";
import { FaBullhorn, FaBoxOpen } from "react-icons/fa";
import api from "../../api/axios";

// Components
import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductDetailModal from "../../components/ui/ProductDetailModal";

export default function UMKM() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // KATEGORI 2 = UMKM
  const CATEGORY_ID = 2; 

  useEffect(() => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        const all = res.data.data || [];
        const filtered = all.filter(p => p.category_id === CATEGORY_ID || p.category?.id === CATEGORY_ID);
        setProducts(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <Navbar />

      {/* 1. SLIDER & DESKRIPSI (TEMA ORANGE) */}
      <div className="relative mb-20">
        <HeroSlider isAdmin={false} />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 -mt-12">
            {/* Border Atas Orange */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-orange-500 text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
                    <FaBullhorn />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">UMKM</h1>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                   Usaha Mikro, Kecil, dan Menengah (UMKM) merupakan jantung kreativitas warga. 
                   Temukan berbagai produk unik, kerajinan tangan, dan kuliner lezat karya masyarakat Tiyuh Kagungan Ratu Agung.
                </p>
            </div>
        </div>
      </div>

      {/* 2. DAFTAR PRODUK */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-6 border-l-4 border-orange-500 pl-4">
            <h2 className="text-2xl font-bold text-gray-800">Katalog UMKM</h2>
            <p className="text-sm text-gray-500">Menampilkan {products.length} produk kreatif.</p>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-400">Memuat data...</div>
        ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border-dashed border-2 border-gray-200">
                <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3"/>
                <p className="text-gray-500">Belum ada produk UMKM saat ini.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition duration-300"
                    onClick={() => setSelectedProduct(item)} 
                >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        {/* Badge Orange */}
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                            UMKM
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-orange-600 transition">{item.product_name}</h3>
                        <div className="font-bold text-gray-800 text-base">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.price)}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                           {item.business_name}
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