import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";
import SkeletonCard from "../../components/ui/SkeletonCard";

export default function Koperasi() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        const data = res.data.data || [];
        const filtered = data.filter(p => p.category?.name === "Koperasi" || p.category_id === 3);
        setProducts(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      <HeroSlider isAdmin={false} />

      {/* DESKRIPSI RESPONSIF */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-3">
                Koperasi Merah Putih
            </h1>
            <div className="w-16 md:w-24 h-1 bg-green-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-sm md:text-lg text-gray-600 leading-relaxed">
                Wadah ekonomi berbasis kekeluargaan. Menyediakan kebutuhan pokok 
                serta produk usaha anggota dengan harga terjangkau.
            </p>
        </div>
      </section>

      {/* GRID PRODUK 2 KOLOM DI HP */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 border-l-4 border-red-600 pl-4">
            Produk Koperasi
        </h2>
        
        {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
           </div>
        ) : products.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed">
               <p className="text-gray-500 text-sm">Belum ada produk Koperasi.</p>
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
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}