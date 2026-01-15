import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export default function SliderCardAdmin({
  slider,
  index,
  onToggle,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slider.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl shadow overflow-hidden transition
        ${!slider.is_active ? "grayscale opacity-60" : ""}
      `}
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={slider.image_url}
          className="h-40 w-full object-cover"
        />

        {/* ORDER NUMBER */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-sm font-bold px-2 py-1 rounded">
          #{index + 1}
        </div>

        {/* DRAG HANDLE */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white cursor-grab active:cursor-grabbing px-2 py-1 rounded shadow text-sm"
        >
          ☰
        </div>
      </div>

      {/* ACTIONS */}
      <div className="p-4 flex justify-between items-center">
        <span
          className={`text-sm font-semibold ${
            slider.is_active ? "text-green-600" : "text-gray-500"
          }`}
        >
          {slider.is_active ? "Aktif" : "Nonaktif"}
        </span>

        <div className="flex gap-2">
          <button
            onClick={onToggle}
            className={`px-3 py-1 text-sm rounded text-white ${
              slider.is_active ? "bg-blue-500" : "bg-green-600"
            }`}
          >
            {slider.is_active ? "Nonaktifkan" : "Aktifkan"}
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
