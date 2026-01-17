import { FaMapMarkerAlt, FaWhatsapp, FaEdit, FaTrash, FaStore } from "react-icons/fa";

export default function ProductCard({ product, isAdmin, onEdit, onDelete, onClick }) {
  
  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer group hover:shadow-md transition-all duration-300"
    >
      {/* BAGIAN GAMBAR */}
      {/* Mobile: h-32 (pendek), Desktop: h-48 (tinggi) */}
      <div className="relative h-32 md:h-48 bg-gray-100 overflow-hidden">
        <img 
          src={product.image_url || "https://via.placeholder.com/300"} 
          alt={product.product_name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge Kategori */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100">
          {product.category?.name || "Umum"}
        </div>
      </div>

      {/* BAGIAN TEXT */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {/* Nama Produk: Text kecil di HP */}
        <h3 className="font-bold text-gray-800 text-xs md:text-base line-clamp-2 mb-1 leading-tight">
            {product.product_name}
        </h3>

        {/* Nama Toko */}
        <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">
            <FaStore className="text-gray-300"/> 
            <span className="truncate max-w-[120px]">{product.business_name}</span>
        </div>

        {/* Harga & Lokasi */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-2 md:pt-3">
            <span className="text-xs md:text-sm font-bold text-green-600">
                {formatRupiah(product.price)}
            </span>
            {product.maps_url && (
                <FaMapMarkerAlt className="text-gray-300 text-[10px] md:text-xs" />
            )}
        </div>

        {/* TOMBOL EDIT/HAPUS (KHUSUS ADMIN) */}
        {isAdmin && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                    className="flex items-center justify-center gap-1 bg-yellow-50 text-yellow-600 py-1.5 rounded text-[10px] md:text-xs font-bold hover:bg-yellow-100 transition"
                >
                    <FaEdit /> Edit
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                    className="flex items-center justify-center gap-1 bg-red-50 text-red-600 py-1.5 rounded text-[10px] md:text-xs font-bold hover:bg-red-100 transition"
                >
                    <FaTrash /> Hapus
                </button>
            </div>
        )}
      </div>
    </div>
  );
}