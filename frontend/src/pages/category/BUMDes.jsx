import { useEffect, useState } from "react";
import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";
import CategoryHero from "../../components/common/CategoryHero";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";

export default function Bumdes() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const filtered = res.data.data.filter(
          (p) => p.category?.name === "BUMDes"
        );
        setProducts(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar />

      <CategoryHero
        title="BUMDes Desa"
        description="Badan Usaha Milik Desa yang mengelola potensi ekonomi desa secara profesional."
        image="/images/hero-bumdes.jpg"
      />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">
          Produk BUMDes
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onClick={() => setSelectedProduct(item)}
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
