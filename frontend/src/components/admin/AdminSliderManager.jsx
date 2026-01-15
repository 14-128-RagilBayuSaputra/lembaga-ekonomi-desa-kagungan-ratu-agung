import { useEffect, useState } from "react";
import api from "../../api/axios";
import SliderCardAdmin from "./SliderCardAdmin";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export default function AdminSliderManager() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= DND SENSORS ================= */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  /* ================= FETCH ================= */
  const fetchSliders = async () => {
    const res = await api.get("/admin/sliders");
    setSliders(res.data.data || []);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  /* ================= IMAGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= ADD ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Pilih gambar dulu");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", imageFile);

      const upload = await api.post("/admin/upload", formData);

      await api.post("/admin/sliders", {
        image_url: upload.data.image_url,
      });

      setImageFile(null);
      setPreview(null);
      fetchSliders();
    } catch {
      alert("Gagal tambah slider");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE ================= */
  const toggleActive = async (slider) => {
    await api.put(`/admin/sliders/${slider.id}`, {
      is_active: !slider.is_active,
    });
    fetchSliders();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Hapus slider ini?")) return;
    await api.delete(`/admin/sliders/${id}`);
    fetchSliders();
  };

  /* ================= DRAG END ================= */
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sliders.findIndex((i) => i.id === active.id);
    const newIndex = sliders.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(sliders, oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i,
    }));

    setSliders(newOrder);

    await api.put("/admin/sliders/reorder/all", {
      orders: newOrder.map((s) => ({
        id: s.id,
        order: s.order,
      })),
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Manajemen Slider Beranda</h1>

      {/* ADD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
      >
        <h2 className="font-semibold">Tambah Slider</h2>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img
            src={preview}
            className="h-48 w-full object-cover rounded"
          />
        )}

        <button className="bg-green-600 text-white px-6 py-2 rounded">
          {loading ? "Menyimpan..." : "Tambah Slider"}
        </button>
      </form>

      {/* LIST + DRAG */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sliders.map((s) => s.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {sliders.map((s, i) => (
              <SliderCardAdmin
                key={s.id}
                slider={s}
                index={i}
                onToggle={() => toggleActive(s)}
                onDelete={() => handleDelete(s.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
