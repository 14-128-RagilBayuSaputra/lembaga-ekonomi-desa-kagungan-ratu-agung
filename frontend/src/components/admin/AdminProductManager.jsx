import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProductCardAdmin from "./ProductCardAdmin";

export default function AdminProductManager({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    business_name: "",
    price: "",
    description: "",
    instagram_url: "",
    whatsapp_url: "",
    shopee_url: "",
    facebook_url: "",
    maps_url: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await api.get("/admin/products");
    const filtered = res.data.data.filter(
      (p) => p.category_id === categoryId
    );
    setProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedImages(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  /* ================= FORM ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) =>
      formData.append(k, v)
    );

    formData.append("category_id", categoryId);

    selectedImages.forEach((img) =>
      formData.append("images", img)
    );

    try {
      await api.post("/admin/products", formData);

      setForm({
        product_name: "",
        business_name: "",
        price: "",
        description: "",
        instagram_url: "",
        whatsapp_url: "",
        shopee_url: "",
        facebook_url: "",
        maps_url: "",
      });

      setSelectedImages([]);
      setPreviewImages([]);

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal upload produk");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus produk ini?")) return;
    await api.delete(`/admin/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">
        Manajemen Produk {title}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          required
          name="product_name"
          placeholder="Nama Produk"
          className="input"
          value={form.product_name}
          onChange={handleChange}
        />

        <input
          required
          name="business_name"
          placeholder="Nama Usaha"
          className="input"
          value={form.business_name}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Harga (opsional)"
          className="input"
          value={form.price}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Deskripsi Produk"
          className="input h-24"
          value={form.description}
          onChange={handleChange}
        />

        {/* MULTI IMAGE */}
        <input
          type="file"
          name="images"          // ⬅️ FIX KRUSIAL
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* PREVIEW */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {previewImages.map((src, i) => (
              <img
                key={i}
                src={src}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </form>

      {/* LIST */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          Belum ada produk
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCardAdmin
              key={p.id}
              product={p}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
