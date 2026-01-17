import { useState } from "react";
import { FaTimes, FaWhatsapp, FaInstagram, FaFacebook, FaStore, FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";

export default function ProductDetailModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  // --- 1. LOGIKA SLIDER GAMBAR ---
  let imageList = [];
  // Masukkan Cover Image
  if (product.image_url) imageList.push(product.image_url);
  // Masukkan Gallery Images (Array)
  if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
          const url = typeof img === 'string' ? img : img.image_url;
          // Hindari duplikat jika cover image ada di dalam gallery juga
          if (url && !imageList.includes(url)) imageList.push(url);
      });
  }
  // Fallback jika tidak ada gambar
  if (imageList.length === 0) imageList.push("https://via.placeholder.com/400x300?text=No+Image");

  const nextImage = () => setCurrentImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));

  // --- 2. AMBIL DATA LINK ---
  const waUrl = product.whatsapp_url;
  const igUrl = product.instagram_url;
  const fbUrl = product.facebook_url;
  const shopeeUrl = product.shopee_url;

  // --- 3. FIX MAPS (INTERAKTIF & BISA DIGESER) ---
  const getInteractiveMapUrl = (originalUrl) => {
    if (!originalUrl) return null;
    
    // Jika user memasukkan link embed bawaan Google, pakai langsung
    if (originalUrl.includes("embed")) return originalUrl;

    let query = "";

    // Cek Koordinat (contoh: @-4.123,105.123)
    const coordsMatch = originalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
        query = `${coordsMatch[1]},${coordsMatch[2]}`;
    } else {
        // Cek Nama Tempat dari URL
        try {
            if (originalUrl.includes("/place/")) {
                const parts = originalUrl.split("/place/");
                if (parts[1]) {
                   query = parts[1].split("/")[0].replace(/\+/g, " ");
                }
            }
        } catch (e) {}
        
        // Fallback: Gunakan Nama Usaha jika tidak ada koordinat/place
        if (!query) query = product.business_name || "Lokasi";
    }

    // Gunakan format standar maps.google.com agar INTERAKTIF (Bisa digeser)
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const finalMapUrl = getInteractiveMapUrl(product.maps_url);

  const formatRupiah = (price) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[95%] md:max-w-4xl overflow-hidden relative animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition shadow-lg"
        >
            <FaTimes size={14} />
        </button>

        {/* === KOLOM KIRI: GAMBAR === */}
        <div className="w-full md:w-1/2 bg-gray-100 relative h-72 md:h-auto group flex-shrink-0 flex items-center justify-center">
            <img 
                src={imageList[currentImageIndex]} 
                alt="Produk" 
                className="w-full h-full object-contain mix-blend-multiply" 
            />
            
            <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-md flex items-center gap-1 z-10">
                <FaStore className="text-green-600"/> {product.category?.name || "Produk"}
            </div>

            {/* Navigasi Slider */}
            {imageList.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 shadow-lg hover:bg-white hover:scale-110 transition"><FaChevronLeft size={16}/></button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 shadow-lg hover:bg-white hover:scale-110 transition"><FaChevronRight size={16}/></button>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {imageList.map((_, idx) => (
                            <div key={idx} className={`h-2 rounded-full transition-all shadow-sm ${currentImageIndex === idx ? "bg-green-600 w-6" : "bg-white w-2"}`} />
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* === KOLOM KANAN: INFO DETAIL === */}
        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                
                {/* Judul & Harga */}
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{product.product_name}</h2>
                    <span className="text-xl font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg inline-block shadow-sm">
                        {formatRupiah(product.price)}
                    </span>
                </div>

                {/* Pemilik */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaStore className="text-gray-400"/>
                    <span>Dijual oleh: <strong className="text-gray-800 uppercase tracking-wide">{product.business_name}</strong></span>
                </div>

                {/* Deskripsi */}
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="whitespace-pre-line">{product.description || "Tidak ada deskripsi detail."}</p>
                </div>

                {/* Tombol Sosmed (Grid Responsif) */}
                <div className="space-y-2">
                    {(waUrl || igUrl || fbUrl || shopeeUrl) && (
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hubungi Penjual</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                        {waUrl && (
                            <a href={waUrl} target="_blank" rel="noreferrer" className="bg-green-100 text-green-700 py-2.5 rounded-lg hover:bg-green-200 transition flex justify-center items-center gap-2 font-bold text-sm">
                                <FaWhatsapp size={18} /> WhatsApp
                            </a>
                        )}
                        {igUrl && (
                            <a href={igUrl} target="_blank" rel="noreferrer" className="bg-pink-100 text-pink-600 py-2.5 rounded-lg hover:bg-pink-200 transition flex justify-center items-center gap-2 font-bold text-sm">
                                <FaInstagram size={18} /> Instagram
                            </a>
                        )}
                        {/* LOGIKA TOMBOL FACEBOOK */}
                        {fbUrl && (
                            <a href={fbUrl} target="_blank" rel="noreferrer" className="bg-blue-100 text-blue-700 py-2.5 rounded-lg hover:bg-blue-200 transition flex justify-center items-center gap-2 font-bold text-sm">
                                <FaFacebook size={18} /> Facebook
                            </a>
                        )}
                        {shopeeUrl && (
                            <a href={shopeeUrl} target="_blank" rel="noreferrer" className="bg-orange-100 text-orange-600 py-2.5 rounded-lg hover:bg-orange-200 transition flex justify-center items-center gap-2 font-bold text-sm">
                                <FaShoppingBag size={18} /> Shopee
                            </a>
                        )}
                    </div>
                </div>

                {/* MAPS (INTERAKTIF) */}
                {finalMapUrl && (
                    <div className="mt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-red-500"/>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lokasi Usaha</span>
                        </div>
                        <div className="h-56 bg-gray-200 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
                            <iframe 
                                src={finalMapUrl}
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Produk"
                            ></iframe>
                            
                             <a 
                                href={product.maps_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="absolute bottom-2 right-2 bg-white text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-1 transition opacity-90 hover:opacity-100"
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