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

  const [images, setImages] = useState([]);

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

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) =>
      formData.append(k, v)
    );
    formData.append("category_id", categoryId);
    images.forEach((img) => formData.append("images", img));

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
      setImages([]);
      fetchProducts_toggle();
    } catch (err) {
      alert("Gagal menambah produk");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts_toggle = () => fetchProducts();

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

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-8"
      >
        {/* INFO UTAMA */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Informasi Produk</h2>

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
        </div>

        {/* MEDIA */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Kontak & Media</h2>

          <input name="whatsapp_url" placeholder="WhatsApp URL" className="input" value={form.whatsapp_url} onChange={handleChange} />
          <input name="instagram_url" placeholder="Instagram URL" className="input" value={form.instagram_url} onChange={handleChange} />
          <input name="facebook_url" placeholder="Facebook URL" className="input" value={form.facebook_url} onChange={handleChange} />
          <input name="shopee_url" placeholder="Shopee URL" className="input" value={form.shopee_url} onChange={handleChange} />
          <input name="maps_url" placeholder="Google Maps URL" className="input" value={form.maps_url} onChange={handleChange} />
        </div>

        {/* GAMBAR */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Gambar Produk</h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="h-24 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </form>

      {/* ================= LIST ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCardAdmin
            key={p.id}
            product={p}
            onDelete={handleDelete}
            onUpdated={fetchProducts_toggle}
          />
        ))}
      </div>
    </div>
  );
}
