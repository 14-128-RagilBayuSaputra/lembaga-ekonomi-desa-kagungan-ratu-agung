import { FaStore, FaEdit, FaTrash } from "react-icons/fa";

export default function ProductCard({ product, onClick, isAdmin, onEdit, onDelete }) {
  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col h-full"
    >
      {/* GAMBAR: HP h-36 (lebih pendek biar ringkas), Laptop h-48 */}
      <div className="h-36 md:h-48 bg-gray-100 relative overflow-hidden flex-shrink-0">
        <img 
          src={product.image_url} 
          alt={product.product_name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
        />
        {product.category?.name && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-gray-700 shadow-sm backdrop-blur-sm">
            {product.category.name}
          </div>
        )}
      </div>

      {/* KONTEN */}
      <div className="p-3 flex flex-col flex-1">
        
        {/* Judul & Harga */}
        <div className="mb-2">
            <h3 className="font-bold text-gray-900 text-xs md:text-sm line-clamp-2 leading-snug group-hover:text-green-600 transition">
                {product.product_name}
            </h3>
            <div className="font-bold text-green-600 text-xs md:text-sm mt-1">
                {formatRupiah(product.price)}
            </div>
        </div>

        {/* Toko */}
        <p className="text-[10px] text-gray-500 flex items-center gap-1 mb-3 mt-auto">
            <FaStore className="text-gray-300"/> 
            <span className="line-clamp-1">{product.business_name}</span>
        </p>

        {/* TOMBOL AKSI (RESPONSIF) */}
        {isAdmin && (
            <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
                {/* Tombol menggunakan flex-1 agar berbagi ruang rata */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                    className="flex-1 bg-yellow-50 text-yellow-600 py-1.5 rounded-md text-[10px] md:text-xs font-bold hover:bg-yellow-100 border border-yellow-200 flex items-center justify-center gap-1"
                >
                    <FaEdit /> <span className="">Edit</span>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                    className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-md text-[10px] md:text-xs font-bold hover:bg-red-100 border border-red-200 flex items-center justify-center gap-1"
                >
                    <FaTrash /> <span className="">Hapus</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
}