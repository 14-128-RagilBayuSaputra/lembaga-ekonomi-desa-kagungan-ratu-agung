import { useEffect, useState } from "react";
import { FaStore, FaHandshake, FaBullhorn, FaArrowRight, FaCamera, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

// COMPONENTS
import Navbar from "../../components/common/Navbar"; 
import HeroSlider from "../../components/common/HeroSlider"; 
import ProductDetailModal from "../../components/ui/ProductDetailModal"; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      <Navbar />

      {/* 1. SLIDER & SAMBUTAN */}
      <div className="relative mb-20">
        <HeroSlider isAdmin={false} />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 -mt-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500 text-center animate-fade-in-up">
                <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-2 block">
                    Potensi Desa Digital
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                    Membangun Ekonomi <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Tiyuh</span>
                </h1>
                <p className="max-w-3xl mx-auto text-gray-500 text-base md:text-lg leading-relaxed">
                   Selamat datang di platform digital Desa Kagungan Ratu Agung. 
                   Temukan dan dukung produk unggulan lokal dari <b>BUMDes, Koperasi, dan UMKM</b> yang berkualitas.
                </p>
            </div>
        </div>
      </div>

      {/* 2. KATEGORI (DENGAN WARNA SHADOW KHUSUS) */}
      <section className="py-10 max-w-7xl mx-auto px-4">
         <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Jelajahi Kategori</h2>
            <p className="text-gray-500 text-sm">Pilih jenis usaha yang ingin Anda cari</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* BUMDes - HIJAU */}
            <div 
                onClick={() => navigate("/bumdes")} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer transition duration-300 group
                hover:-translate-y-2 hover:border-green-400 hover:shadow-[0_10px_30px_-10px_rgba(22,163,74,0.5)]"
            >
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-green-600 group-hover:text-white transition">
                    <FaStore />
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700">BUMDes</h3>
                <p className="text-xs text-gray-500 mb-4">Pendapatan asli desa</p>
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-green-600 opacity-50 group-hover:opacity-100 group-hover:bg-green-600 group-hover:text-white transition">
                    <FaArrowRight size={12}/>
                </span>
            </div>

            {/* Koperasi - BIRU */}
            <div 
                onClick={() => navigate("/koperasi")} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer transition duration-300 group
                hover:-translate-y-2 hover:border-blue-400 hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]"
            >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                    <FaHandshake />
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700">Koperasi</h3>
                <p className="text-xs text-gray-500 mb-4">Kesejahteraan anggota</p>
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-blue-600 opacity-50 group-hover:opacity-100 group-hover:bg-blue-600 group-hover:text-white transition">
                    <FaArrowRight size={12}/>
                </span>
            </div>

            {/* UMKM - ORANGE */}
            <div 
                onClick={() => navigate("/umkm")} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center cursor-pointer transition duration-300 group
                hover:-translate-y-2 hover:border-orange-400 hover:shadow-[0_10px_30px_-10px_rgba(234,88,12,0.5)]"
            >
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-orange-600 group-hover:text-white transition">
                    <FaBullhorn />
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-700">UMKM</h3>
                <p className="text-xs text-gray-500 mb-4">Kreativitas warga</p>
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-orange-600 opacity-50 group-hover:opacity-100 group-hover:bg-orange-600 group-hover:text-white transition">
                    <FaArrowRight size={12}/>
                </span>
            </div>
         </div>
      </section>

      {/* 3. LANGKAH TEKNIS (BACKGROUND HIJAU + BUTTON ACCENTS) */}
      <section className="py-16 bg-green-600 my-10 relative overflow-hidden">
          {/* Hiasan Background Abstrak */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-10 -ml-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-black opacity-10 rounded-full -mb-20 -mr-20 blur-3xl"></div>

          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">Ingin Produk Anda Tampil Disini?</h2>
              <p className="text-green-100 text-sm mb-10 max-w-2xl mx-auto">
                  Kami memfasilitasi warga desa untuk memasarkan produknya secara digital. Ikuti langkah mudah berikut ini.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Step 1 */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl cursor-default">
                      <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border-2 border-green-100">
                          <FaCamera />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">1. Siapkan Foto</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Foto produk dengan jelas. Siapkan deskripsi, harga, dan lokasi usaha.
                      </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl cursor-pointer group"
                       onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                  >
                      <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-green-200 shadow-md group-hover:scale-110 transition">
                          <FaWhatsapp />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">2. Kirim ke Admin</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">
                          Hubungi Admin via WhatsApp. Kirimkan data produk Anda.
                      </p>
                      <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold group-hover:bg-green-600 group-hover:text-white transition">
                          Hubungi Sekarang
                      </span>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl cursor-default">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border-2 border-blue-100">
                          <FaCheckCircle />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">3. Produk Tayang</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Produk Anda diverifikasi dan langsung muncul di website ini.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. PRODUK TERBARU */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Produk Terbaru</h2>
                <p className="text-sm text-gray-500 mt-1">Update produk terkini dari warga desa.</p>
            </div>
            <button onClick={() => navigate("/umkm")} className="text-green-600 text-sm font-bold hover:underline">
                Lihat Semua &rarr;
            </button>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-400">Memuat produk...</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition duration-300"
                    onClick={() => setSelectedProduct(item)} 
                >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                            Baru
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="text-[10px] text-green-600 font-bold uppercase mb-1">{item.category?.name}</div>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-green-600 transition">{item.product_name}</h3>
                        <div className="font-bold text-gray-800 text-base">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.price)}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </section>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}