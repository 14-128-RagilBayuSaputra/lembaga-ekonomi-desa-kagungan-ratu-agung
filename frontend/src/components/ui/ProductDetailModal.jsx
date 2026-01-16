import { useState } from "react";
import { FaTimes, FaWhatsapp, FaInstagram, FaStore, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";

export default function ProductDetailModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  // --- 1. SLIDER GAMBAR ---
  let imageList = [];
  if (product.image_url) imageList.push(product.image_url);
  if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
          const url = typeof img === 'string' ? img : img.image_url;
          if (url && url !== product.image_url) imageList.push(url);
      });
  }
  if (imageList.length === 0) imageList.push("https://via.placeholder.com/400x300?text=No+Image");

  const nextImage = () => setCurrentImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));

  // --- 2. DATA ---
  const waUrl = product.whatsapp_url;
  const igUrl = product.instagram_url;
  
  // --- 3. MAPS INTERAKTIF (KOORDINAT) ---
  const getEmbedMapUrl = (originalUrl) => {
    if (!originalUrl) return null;
    if (originalUrl.includes("embed") || originalUrl.includes("output=embed")) return originalUrl;

    // Coba ambil koordinat
    const coordsMatch = originalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
        const [_, lat, lng] = coordsMatch;
        return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=15&output=embed`;
    }

    // Fallback nama tempat
    let searchQuery = encodeURIComponent(product.business_name || "Lokasi");
    if (originalUrl.includes("/maps/place/")) {
         try {
            const splitUrl = originalUrl.split("/maps/place/");
            if (splitUrl[1]) {
                searchQuery = splitUrl[1].split("/")[0].replace(/\+/g, " "); 
            }
         } catch (e) {}
    }
    return `https://maps.google.com/maps?q=${searchQuery}&hl=id&z=15&output=embed`;
  };

  const finalMapUrl = getEmbedMapUrl(product.maps_url);

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md md:max-w-3xl overflow-hidden relative animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tombol Close */}
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition shadow-lg"
        >
            <FaTimes size={14} />
        </button>

        {/* === KOLOM KIRI: GAMBAR === */}
        {/* - Mobile: h-64 (Agar pas, tidak terlalu kecil)
           - Desktop: md:w-1/2 (50% Lebar - Lebih besar dari sebelumnya) 
           - Background: bg-gray-100 (Terang - agar terlihat menyatu/besar)
        */}
        <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto group flex-shrink-0 flex items-center justify-center">
            {/* object-contain: Gambar Utuh (Full) */}
            <img 
                src={imageList[currentImageIndex]} 
                alt="Produk" 
                className="w-full h-full object-contain mix-blend-multiply" // mix-blend agar background putih di gambar jpg menyatu
            />
            
            <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-md flex items-center gap-1 z-10">
                <FaStore className="text-green-600"/> {product.category?.name || "Produk"}
            </div>

            {/* Navigasi Slider */}
            {imageList.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition"><FaChevronLeft size={14}/></button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition"><FaChevronRight size={14}/></button>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {imageList.map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? "bg-green-600 w-4" : "bg-white/70"}`} />
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* === KOLOM KANAN: DETAIL INFO === */}
        {/* Desktop: md:w-1/2 (Sisanya 50%) */}
        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-hidden">
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* 1. Judul & Harga */}
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                        {product.product_name}
                    </h2>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                            {formatRupiah(product.price)}
                        </span>
                    </div>
                </div>

                {/* 2. Info Penjual */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaStore className="text-gray-400"/>
                    <span>Dijual oleh: <strong className="text-gray-700">{product.business_name || "Warga Desa"}</strong></span>
                </div>

                {/* 3. Deskripsi */}
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Deskripsi Produk</h3>
                    <p className="whitespace-pre-line">
                        {product.description || "Tidak ada deskripsi detail."}
                    </p>
                </div>

                {/* 4. Kontak Media Sosial */}
                {(waUrl || igUrl) && (
                    <div className="flex gap-3 pt-2">
                        {waUrl && (
                            <a href={waUrl} target="_blank" rel="noreferrer" className="flex-1 bg-green-100 text-green-700 py-2.5 rounded-xl hover:bg-green-200 transition flex justify-center items-center gap-2 font-bold text-sm">
                                <FaWhatsapp size={18} /> WhatsApp
                            </a>
                        )}
                        {igUrl && (
                            <a href={igUrl} target="_blank" rel="noreferrer" className="flex-1 bg-pink-100 text-pink-600 py-2.5 rounded-xl hover:bg-pink-200 transition flex justify-center items-center gap-2 font-bold text-sm">
                                <FaInstagram size={18} /> Instagram
                            </a>
                        )}
                    </div>
                )}

                {/* 5. MAPS (Interaktif & Bisa Digeser) */}
                {finalMapUrl && (
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Lokasi Usaha</h3>
                        </div>
                        
                        <div className="w-full h-56 bg-gray-200 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
                            <iframe 
                                src={finalMapUrl}
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, pointerEvents: 'auto' }} 
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Produk"
                            ></iframe>
                            
                             <a 
                                href={product.maps_url}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute bottom-2 right-2 bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded shadow hover:bg-gray-50 transition flex items-center gap-1 opacity-90 hover:opacity-100"
                            >
                                <FaExternalLinkAlt size={10}/> Buka App
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}