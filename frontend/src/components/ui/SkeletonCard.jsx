export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col h-full">
      {/* Bagian Gambar (Kotak Abu-abu) */}
      <div className="h-48 bg-gray-200 w-full" />
      
      {/* Bagian Konten */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Judul */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        {/* Subjudul */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        
        {/* Deskripsi */}
        <div className="h-3 bg-gray-200 rounded w-full mt-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        
        {/* Footer (Harga & Tombol) */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}3