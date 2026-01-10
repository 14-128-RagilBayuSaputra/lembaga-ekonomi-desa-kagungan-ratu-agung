import { useEffect, useState } from "react";
import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductDetailModal from "../../components/ui/ProductDetailModal";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  /* ================= FETCH LIST ================= */
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch(console.error);
  }, []);

  /* ================= FETCH DETAIL ================= */
  const openProduct = async (id) => {
    try {
      setLoadingDetail(true);
      const res = await api.get(`/products/${id}`);
      setSelectedProduct(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Gagal membuka produk");
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <>
      <Navbar />
      <HeroSlider />

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-3">
          Tentang Lembaga Ekonomi Desa
        </h2>
        <p className="text-gray-600">
          Lembaga Ekonomi Desa mengelola potensi ekonomi desa melalui BUMDes,
          UMKM, dan koperasi untuk meningkatkan kesejahteraan masyarakat.
        </p>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">
          Produk Unggulan Desa
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              onClick={() => openProduct(item.id)}
              className="bg-white rounded shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={item.image_url}
                alt={item.product_name}
                className="w-full h-40 object-cover rounded-t"
              />

              <div className="p-4">
                <h3 className="font-semibold">
                  {item.product_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.business_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {loadingDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-white">
          Memuat produk...
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
