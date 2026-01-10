import { useState } from "react";
import api from "../../api/axios";

export default function ProductCardAdmin({ product, onDelete, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);

  const [form, setForm] = useState({
    product_name: product.product_name || "",
    business_name: product.business_name || "",
    price: product.price || "",
    description: product.description || "",
    whatsapp_url: product.whatsapp_url || "",
    instagram_url: product.instagram_url || "",
    facebook_url: product.facebook_url || "",
    shopee_url: product.shopee_url || "",
    maps_url: product.maps_url || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v)
      );
      newImages.forEach((f) =>
        formData.append("images", f)
      );

      await api.put(`/admin/products/${product.id}`, formData);

      setOpen(false);
      setNewImages([]);
      onUpdated(); // 🔥 refresh list
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE IMAGE ================= */
  const deleteImage = async (imageId) => {
    if (!confirm("Hapus gambar ini?")) return;
    await api.delete(`/admin/products/image/${imageId}`);
    onUpdated();
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="grid grid-cols-2 gap-2 p-2 bg-gray-100">
          {product.images?.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              className="h-32 w-full object-cover rounded"
            />
          ))}
        </div>

        <div className="p-4 space-y-1">
          <h3 className="font-semibold">{product.product_name}</h3>
          <p className="text-sm text-gray-500">{product.business_name}</p>

          {product.price && (
            <p className="text-green-600 font-bold">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setOpen(true)}
              className="flex-1 bg-blue-500 text-white py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex-1 bg-red-500 text-white py-2 rounded"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4 overflow-y-auto max-h-[90vh]">

            <h2 className="text-xl font-bold">Edit Produk</h2>

            <input name="product_name" value={form.product_name} onChange={handleChange} className="input" placeholder="Nama Produk" />
            <input name="business_name" value={form.business_name} onChange={handleChange} className="input" placeholder="Nama Usaha" />
            <input name="price" value={form.price} onChange={handleChange} className="input" placeholder="Harga" />

            <textarea name="description" value={form.description} onChange={handleChange} className="input h-24" placeholder="Deskripsi" />

            <input name="whatsapp_url" value={form.whatsapp_url} onChange={handleChange} className="input" placeholder="WhatsApp URL" />
            <input name="instagram_url" value={form.instagram_url} onChange={handleChange} className="input" placeholder="Instagram URL" />
            <input name="facebook_url" value={form.facebook_url} onChange={handleChange} className="input" placeholder="Facebook URL" />
            <input name="shopee_url" value={form.shopee_url} onChange={handleChange} className="input" placeholder="Shopee URL" />
            <input name="maps_url" value={form.maps_url} onChange={handleChange} className="input" placeholder="Google Maps URL" />

            {/* EXISTING IMAGES */}
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.image_url} className="h-20 w-full object-cover rounded" />
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* ADD NEW */}
            <input type="file" multiple onChange={(e) => setNewImages([...e.target.files])} />

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>

              <button
                disabled={loading}
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
