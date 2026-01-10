import api from "../../api/axios";

export default function SliderCardAdmin({ slider, onDelete }) {
  const toggleActive = async () => {
    await api.put(`/admin/sliders/${slider.id}`, {
      is_active: !slider.is_active,
    });
    location.reload();
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src={slider.image_url}
        className="h-40 w-full object-cover"
      />

      <div className="p-4 flex justify-between items-center">
        <span
          className={`text-sm font-semibold ${
            slider.is_active ? "text-green-600" : "text-red-500"
          }`}
        >
          {slider.is_active ? "Aktif" : "Nonaktif"}
        </span>

        <div className="flex gap-2">
          <button
            onClick={toggleActive}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
          >
            Toggle
          </button>

          <button
            onClick={() => onDelete(slider.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
