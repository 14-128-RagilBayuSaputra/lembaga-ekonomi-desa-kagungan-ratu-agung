import { useEffect, useState } from "react";
import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";

export default function UMKM() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const filtered = res.data.data.filter(
          (p) => p.category?.name === "UMKM"
        );
        setProducts(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <HeroSlider />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Produk UMKM</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">Belum ada produk UMKM</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onClick={() => setSelectedProduct(item)}
              />
            ))}
          </div>
        )}
      </section>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
