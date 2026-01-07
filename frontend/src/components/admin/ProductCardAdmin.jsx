import { useState } from "react";
import api from "../../api/axios";

export default function ProductCardAdmin({ product, onDelete, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    product_name: product.product_name,
    business_name: product.business_name,
    price: product.price || "",
    description: product.description || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) =>
      formData.append(k, v)
    );

    files.forEach((f) => formData.append("images", f));

    try {
      await api.put(`/admin/products/${product.id}`, formData);
      setIsEditing(false);
      setFiles([]);
      onUpdated();
    } catch (err) {
      alert("Gagal update produk");
      console.error(err);
    }
  };

  /* ================= VIEW MODE ================= */
  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* IMAGE GALLERY */}
        <div className="flex flex-col gap-2 p-2 bg-gray-100">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <img
                key={img.id}
                src={img.image_url}
                alt={`produk-${idx}`}
                className="w-full h-40 object-cover rounded"
              />
            ))
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-200 rounded">
              No Image
            </div>
          )}
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
              onClick={() => setIsEditing(true)}
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
    );
  }

  /* ================= EDIT MODE ================= */
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3 border-2 border-blue-400">
      <h3 className="font-bold text-blue-600">Edit Produk</h3>

      <input
        name="product_name"
        value={form.product_name}
        onChange={handleChange}
        className="input"
        placeholder="Nama Produk"
      />

      <input
        name="business_name"
        value={form.business_name}
        onChange={handleChange}
        className="input"
        placeholder="Nama Usaha"
      />

      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        className="input"
        placeholder="Harga"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="input h-24"
        placeholder="Deskripsi"
      />

      {/* EXISTING IMAGES */}
      <div className="grid grid-cols-4 gap-2">
        {product.images?.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            className="h-20 w-full object-cover rounded"
          />
        ))}
      </div>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>

        <button
          onClick={() => setIsEditing(false)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
