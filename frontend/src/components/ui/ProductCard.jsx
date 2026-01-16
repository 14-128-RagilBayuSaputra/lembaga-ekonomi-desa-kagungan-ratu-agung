// ... import lainnya
import { FaMapMarkerAlt, FaEdit, FaTrash, FaEyeSlash } from "react-icons/fa";

export default function ProductCard({ product, onClick, isAdmin, onEdit, onDelete }) {
  // Cek status aktif (asumsi backend mengirim field is_active)
  const isActive = product.is_active !== false; // Default true jika field tidak ada

  return (
    <div
      onClick={!isAdmin ? onClick : undefined}
      // Jika tidak aktif & admin, beri efek grayscale dan opacity
      className={`group bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 transition-all duration-300 flex flex-col h-full relative ${isAdmin && !isActive ? 'grayscale opacity-70 hover:opacity-100 hover:grayscale-0' : 'hover:shadow-2xl hover:-translate-y-1'}`}
    >
      {/* --- ADMIN BADGE JIKA NON-AKTIF --- */}
      {isAdmin && !isActive && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs font-bold py-1 text-center z-20 flex items-center justify-center gap-1">
            <FaEyeSlash /> NON-AKTIF (Disembunyikan)
        </div>
      )}

      {/* IMAGE WRAPPER (Sama seperti sebelumnya) */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={onClick}>
         {/* ... code gambar sama ... */}
         <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
         {/* ... badge kategori sama ... */}
      </div>

      {/* INFO WRAPPER (Sama seperti sebelumnya) */}
      <div className="p-5 flex-1 flex flex-col">
         {/* ... content nama, deskripsi, harga sama ... */}
         <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-desa-primary transition-colors">{product.product_name}</h3>
         {/* ... dst ... */}
      </div>

      {/* === ACTION BUTTONS FOR ADMIN (Sama tapi dengan tooltip) === */}
      {isAdmin && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px] z-30">
             {/* Tombol Edit */}
            <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="bg-amber-500 text-white p-3 rounded-full hover:bg-amber-600 shadow-lg transform hover:scale-110 transition" title="Edit Produk & Status">
                <FaEdit size={18} />
            </button>
             {/* Tombol Hapus */}
            <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="bg-desa-danger text-white p-3 rounded-full hover:bg-red-700 shadow-lg transform hover:scale-110 transition" title="Hapus Permanen">
                <FaTrash size={18} />
            </button>
        </div>
      )}
    </div>
  );
}