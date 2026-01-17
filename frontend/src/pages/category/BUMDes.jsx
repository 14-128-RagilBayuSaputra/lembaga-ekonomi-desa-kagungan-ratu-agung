import { useState, useEffect } from "react";
import { FaStore, FaSearch, FaBoxOpen } from "react-icons/fa";
import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider"; 
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";
import SkeletonCard from "../../components/ui/SkeletonCard";

export default function Bumdes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewProduct, setPreviewProduct] = useState(null);

  useEffect(() => {
    api.get("/products?category=BUMDes")
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => p.product_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />
      
      <HeroSlider isAdmin={false} isHomePage={false} hideText={true} />

      {/* KARTU FLOATING - Padding Mobile disesuaikan (p-6) */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 md:-mt-16 relative z-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-green-500 text-center animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-full mb-3 md:mb-4">
                  <FaStore className="text-2xl md:text-3xl" />
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2">
                  Produk <span className="text-green-600">BUMDes</span>
              </h1>
              <p className="text-xs md:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
                  Dukung kemandirian ekonomi desa dengan membeli produk-produk asli Badan Usaha Milik Desa.
              </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-20">
         <div className="flex justify-center mb-8 md:mb-10">
             <div className="relative w-full max-w-md">
                <input 
                    type="text" placeholder="Cari produk BUMDes..." 
                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition text-sm md:text-base"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
         </div>

         {/* GRID 2 KOLOM DI MOBILE */}
         {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                 {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
             </div>
         ) : filtered.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                 {filtered.map((item) => (
                     <div key={item.id} className="hover:-translate-y-1 transition duration-300">
                         <ProductCard product={item} isAdmin={false} onClick={() => setPreviewProduct(item)} />
                     </div>
                 ))}
             </div>
         ) : (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                 <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3" />
                 <p className="text-gray-500">Belum ada produk.</p>
             </div>
         )}
      </div>
      <ProductDetailModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
    </div>
  );
}