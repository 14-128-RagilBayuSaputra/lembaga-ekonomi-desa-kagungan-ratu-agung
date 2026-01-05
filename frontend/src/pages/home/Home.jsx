import { useEffect, useState } from "react";
import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data.data || []))
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <HeroSlider />

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-4">
          Tentang Lembaga Ekonomi Desa
        </h2>
        <p className="text-gray-600 max-w-3xl">
          Lembaga Ekonomi Desa mengelola potensi ekonomi desa melalui
          BUMDes, UMKM, dan koperasi untuk meningkatkan kesejahteraan masyarakat.
        </p>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold mb-8">
          Produk Unggulan Desa
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
