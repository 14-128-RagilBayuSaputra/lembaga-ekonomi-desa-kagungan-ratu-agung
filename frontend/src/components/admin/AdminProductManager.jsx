import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProductCardAdmin from "./ProductCardAdmin";
import ProductFormModal from "./ProductFormModal";

export default function AdminProductManager({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await api.get("/admin/products");
    setProducts(res.data.data.filter(p => p.category_id === categoryId));
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  /* ================= ADD ================= */
  const handleAdd = async (form, images) => {
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("category_id", categoryId);
      images.forEach(img => formData.append("images", img));

      await api.post("/admin/products", formData);

      setOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal menambah produk");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus produk?")) return;
    await api.delete(`/admin/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Manajemen Produk {title}
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Tambah Produk
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map(p => (
          <ProductCardAdmin
            key={p.id}
            product={p}
            onDelete={handleDelete}
            onUpdated={fetchProducts}
          />
        ))}
      </div>

      {/* MODAL ADD */}
      <ProductFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAdd}
        loading={loading}
      />
    </div>
  );
}
