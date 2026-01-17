import { useState } from "react";
import api from "../../api/axios";
import ProductFormModal from "./ProductFormModal";

export default function ProductCardAdmin({ product, onDelete, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= UPDATE ================= */
  const handleUpdate = async (form, images) => {
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v)
      );
      images.forEach((img) =>
        formData.append("images", img)
      );

      await api.put(`/admin/products/${product.id}`, formData);

      setOpen(false);
      onUpdated();
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
            <div key={img.id} className="relative">
              <img
                src={img.image_url}
                className="h-32 w-full object-cover rounded"
              />
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
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

      {/* MODAL EDIT */}
      <ProductFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleUpdate}
        loading={loading}
        initialData={product}
      />
    </>
  );
}
  