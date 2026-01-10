import { useEffect, useState } from "react";
import api from "../../api/axios";
import SliderCardAdmin from "./SliderCardAdmin";

export default function AdminSliderManager() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= FETCH ADMIN SLIDERS ================= */
  const fetchSliders = async () => {
    const res = await api.get("/admin/sliders");
    setSliders(res.data.data || []);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // cleanup old preview
    if (preview) URL.revokeObjectURL(preview);

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= ADD SLIDER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Pilih gambar slider terlebih dahulu");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", imageFile);

      // ⬅️ JANGAN set Content-Type manual
      const upload = await api.post("/admin/upload", formData);
      const image_url = upload.data.image_url;

      await api.post("/admin/sliders", {
        title: "",
        description: "",
        image_url,
      });

      // reset state
      setImageFile(null);
      setPreview(null);

      fetchSliders();
    } catch (err) {
      console.error(err);
      alert("Gagal menambah slider");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Hapus slider ini?")) return;
    await api.delete(`/admin/sliders/${id}`);
    fetchSliders();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Manajemen Slider Beranda</h1>

      {/* ADD SLIDER */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
      >
        <h2 className="font-semibold">Tambah Slider</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            className="h-48 w-full object-cover rounded"
          />
        )}

        <button
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Menyimpan..." : "Tambah Slider"}
        </button>
      </form>

      {/* LIST SLIDER */}
      <div className="grid md:grid-cols-3 gap-6">
        {sliders.map((s) => (
          <SliderCardAdmin
            key={s.id}
            slider={s}
            onDelete={handleDelete}
            onUpdated={fetchSliders}
          />
        ))}
      </div>
    </div>
  );
}
