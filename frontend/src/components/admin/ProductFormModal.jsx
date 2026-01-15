import { useEffect, useState } from "react";

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
}) {
  const isEdit = Boolean(initialData);

  const emptyForm = {
    product_name: "",
    business_name: "",
    price: "",
    description: "",
    whatsapp_url: "",
    instagram_url: "",
    facebook_url: "",
    shopee_url: "",
    maps_url: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  /* ================= PREFILL (EDIT) ================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        product_name: initialData.product_name || "",
        business_name: initialData.business_name || "",
        price: initialData.price || "",
        description: initialData.description || "",
        whatsapp_url: initialData.whatsapp_url || "",
        instagram_url: initialData.instagram_url || "",
        facebook_url: initialData.facebook_url || "",
        shopee_url: initialData.shopee_url || "",
        maps_url: initialData.maps_url || "",
      });

      // preview gambar lama
      if (initialData.images?.length) {
        setPreviewImages(initialData.images.map((i) => i.image_url));
      }
    } else {
      resetForm();
    }
    // eslint-disable-next-line
  }, [initialData, open]);

  /* ================= CLEANUP PREVIEW ================= */
  useEffect(() => {
    return () => {
      previewImages.forEach((src) => {
        if (src.startsWith("blob:")) URL.revokeObjectURL(src);
      });
    };
  }, [previewImages]);

  const resetForm = () => {
    setForm(emptyForm);
    setImages([]);
    setPreviewImages([]);
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((f) => URL.createObjectURL(f));
    setImages(files);
    setPreviewImages(previews);
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form, images);
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-4xl rounded-2xl p-6 space-y-6 overflow-y-auto max-h-[90vh] animate-scaleIn"
      >
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold">
            {isEdit ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button type="button" onClick={closeModal} className="text-xl">
            ✕
          </button>
        </div>

        {/* ================= INFORMASI PRODUK ================= */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-md space-y-4">
          <h3 className="font-semibold text-gray-700">Informasi Produk</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border shadow-sm"
              placeholder="Nama Produk"
            />

            <input
              required
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border shadow-sm"
              placeholder="Nama Usaha"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border shadow-sm"
              placeholder="Harga (opsional)"
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border shadow-sm h-28"
            placeholder="Deskripsi Produk"
          />
        </div>

        {/* ================= KONTAK & MEDIA ================= */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-md space-y-4">
          <h3 className="font-semibold text-gray-700">Kontak & Media</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="whatsapp_url" value={form.whatsapp_url} onChange={handleChange} className="input-ui" placeholder="WhatsApp URL" />
            <input name="instagram_url" value={form.instagram_url} onChange={handleChange} className="input-ui" placeholder="Instagram URL" />
            <input name="facebook_url" value={form.facebook_url} onChange={handleChange} className="input-ui" placeholder="Facebook URL" />
            <input name="shopee_url" value={form.shopee_url} onChange={handleChange} className="input-ui" placeholder="Shopee URL" />
            <input name="maps_url" value={form.maps_url} onChange={handleChange} className="input-ui md:col-span-2" placeholder="Google Maps URL" />
          </div>
        </div>

        {/* ================= GAMBAR ================= */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-md space-y-4">
          <h3 className="font-semibold text-gray-700">Gambar Produk</h3>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {previewImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-24 w-full object-cover rounded-lg shadow"
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= ACTION ================= */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Batal
          </button>

          <button
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
