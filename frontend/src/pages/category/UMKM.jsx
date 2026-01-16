import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";
import SkeletonCard from "../../components/ui/SkeletonCard";

export default function UMKM() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        const data = res.data.data || [];
        // Filter khusus UMKM
        const filtered = data.filter(p => p.category?.name === "UMKM" || p.category_id === 2);
        setProducts(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      <HeroSlider isAdmin={false} />

      {/* === BAGIAN DESKRIPSI (BARU) === */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-4">Usaha Mikro, Kecil, dan Menengah (UMKM)</h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
                Temukan berbagai produk kreatif dan olahan rumahan asli buatan warga desa kami. 
                Dari kuliner lezat hingga kerajinan tangan unik, setiap produk UMKM yang Anda beli 
                turut membantu memutar roda perekonomian keluarga di desa.
            </p>
        </div>
      </section>

      {/* === DAFTAR PRODUK === */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-green-600 pl-4">Jelajahi Produk UMKM</h2>
        
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
           </div>
        ) : products.length === 0 ? (
           <p className="text-center text-gray-500 py-10">Belum ada produk UMKM yang ditampilkan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}