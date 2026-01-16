import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";
import SkeletonCard from "../../components/ui/SkeletonCard"; // Pastikan sudah import Skeleton

export default function BUMDes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        const data = res.data.data || [];
        // Filter khusus BUMDes (Sesuaikan ID atau String kategory Anda)
        const filtered = data.filter(p => p.category?.name === "BUMDes" || p.category_id === 1);
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
            <h1 className="text-3xl font-bold text-green-700 mb-4">Badan Usaha Milik Desa (BUMDes)</h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
                BUMDes adalah pilar kegiatan ekonomi di desa yang berfungsi sebagai lembaga sosial dan komersial. 
                Kami mengelola aset desa, jasa pelayanan, dan usaha lainnya untuk sebesar-besarnya 
                kesejahteraan masyarakat desa. Dukung kemandirian desa dengan membeli produk BUMDes!
            </p>
        </div>
      </section>

      {/* === DAFTAR PRODUK === */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-green-600 pl-4">Produk BUMDes Unggulan</h2>
        
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
           </div>
        ) : products.length === 0 ? (
           <p className="text-center text-gray-500 py-10">Belum ada produk BUMDes yang ditampilkan.</p>
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