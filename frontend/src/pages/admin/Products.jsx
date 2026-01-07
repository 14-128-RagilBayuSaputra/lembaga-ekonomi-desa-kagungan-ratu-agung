import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    business_name: "",
    price: "",
    description: "",
    category_id: "",
    whatsapp_url: "",
    instagram_url: "",
    facebook_url: "",
    shopee_url: "",
    maps_url: "",
  });

  const [imageFile, setImageFile] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchProducts = async () => {
    const res = await api.get("/admin/products");
    setProducts(res.data.data || []);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data || []);
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= HANDLER ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await api.post("/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUploading(false);
    return res.data.image_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const image_url = await uploadImage();

      await api.post("/admin/products", {
        ...form,
        price: form.price ? Number(form.price) : null,
        category_id: Number(form.category_id),
        image_url,
      });

      alert("Produk berhasil ditambahkan");

      setForm({
        product_name: "",
        business_name: "",
        price: "",
        description: "",
        category_id: "",
        whatsapp_url: "",
        instagram_url: "",
        facebook_url: "",
        shopee_url: "",
        maps_url: "",
      });
      setImageFile(null);

      fetchProducts();
    } catch (err) {
      alert("Gagal menambah produk");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus produk?")) return;
    await api.delete(`/admin/products/${id}`);
    fetchProducts();
  };

  if (loading) return <p>Loading...</p>;

  /* ================= RENDER ================= */
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manajemen Produk</h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 space-y-3"
      >
        <h2 className="font-semibold mb-2">Tambah Produk</h2>

        <input
          name="product_name"
          placeholder="Nama Produk"
          value={form.product_name}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <input
          name="business_name"
          placeholder="Nama Usaha"
          value={form.business_name}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <input
          name="price"
          placeholder="Harga (opsional)"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="description"
          placeholder="Deskripsi Produk"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

        <input
          name="whatsapp_url"
          placeholder="WhatsApp URL"
          value={form.whatsapp_url}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="instagram_url"
          placeholder="Instagram URL"
          value={form.instagram_url}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="facebook_url"
          placeholder="Facebook URL"
          value={form.facebook_url}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="shopee_url"
          placeholder="Shopee URL"
          value={form.shopee_url}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="maps_url"
          placeholder="Google Maps URL"
          value={form.maps_url}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          disabled={uploading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {uploading ? "Mengupload..." : "Simpan"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Produk</th>
            <th className="p-2 text-left">Usaha</th>
            <th className="p-2 text-left">Kategori</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.product_name}</td>
              <td className="p-2">{p.business_name}</td>
              <td className="p-2">{p.category?.name}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                Belum ada produk
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
