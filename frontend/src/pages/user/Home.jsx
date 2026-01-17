import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStore, FaHandshake, FaBullhorn, FaArrowRight, FaBoxOpen, FaLeaf, FaWhatsapp, FaCamera, FaUserCheck, FaRocket } from "react-icons/fa";
import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductDetailModal from "../../components/ui/ProductDetailModal";

export default function Home() {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewProduct, setPreviewProduct] = useState(null);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const all = res.data.data || [];
        setRecentProducts(all.slice(0, 8));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    {
      title: "BUMDes",
      desc: "Produk unggulan badan usaha desa.",
      path: "/bumdes",
      icon: <FaStore className="text-2xl md:text-4xl text-green-600 mb-2 md:mb-3" />,
      color: "border-green-200 hover:border-green-400 hover:shadow-green-100"
    },
    {
      title: "Koperasi",
      desc: "Layanan dan produk kesejahteraan.",
      path: "/koperasi",
      icon: <FaHandshake className="text-2xl md:text-4xl text-blue-600 mb-2 md:mb-3" />,
      color: "border-blue-200 hover:border-blue-400 hover:shadow-blue-100"
    },
    {
      title: "UMKM",
      desc: "Karya kreatif warga Tiyuh.",
      path: "/umkm",
      icon: <FaBullhorn className="text-2xl md:text-4xl text-orange-600 mb-2 md:mb-3" />,
      color: "border-orange-200 hover:border-orange-400 hover:shadow-orange-100"
    }
  ];

  // TEKS PANDUAN KEMBALI LENGKAP & JELAS
  const steps = [
    { 
        num: "01", 
        title: "Hubungi Admin", 
        desc: "Datang ke Balai Desa atau chat WhatsApp Admin kami.", 
        icon: <FaWhatsapp className="text-lg md:text-2xl text-white" />, 
        color: "bg-green-500" 
    },
    { 
        num: "02", 
        title: "Kirim Data", 
        desc: "Kirim foto produk, deskripsi, dan harga yang jelas.", 
        icon: <FaCamera className="text-lg md:text-2xl text-white" />, 
        color: "bg-blue-500" 
    },
    { 
        num: "03", 
        title: "Verifikasi", 
        desc: "Admin akan mengecek data agar sesuai standar.", 
        icon: <FaUserCheck className="text-lg md:text-2xl text-white" />, 
        color: "bg-orange-500" 
    },
    { 
        num: "04", 
        title: "Terbit", 
        desc: "Produk tayang di web dan siap dilihat pembeli.", 
        icon: <FaRocket className="text-lg md:text-2xl text-white" />, 
        color: "bg-purple-500" 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <Navbar />

      <HeroSlider isAdmin={false} isHomePage={true} hideText={true} />

      {/* KARTU SAMBUTAN */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 md:-mt-16 relative z-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-green-500 text-center animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 text-green-600 rounded-full mb-2 md:mb-3">
                  <FaLeaf className="text-sm md:text-base"/>
              </div>
              <span className="block text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Potensi Desa Digital</span>
              <h1 className="text-xl md:text-4xl font-extrabold text-gray-900 mb-2">
                  Membangun Ekonomi <span className="text-green-600">Tiyuh</span>
              </h1>
              <p className="text-xs md:text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                  Temukan produk unggulan lokal dari <b>BUMDes, Koperasi, dan UMKM</b>.
              </p>
          </div>
      </div>

      {/* KATEGORI (2 Kolom Mobile) */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Kategori</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {categories.map((cat, idx) => (
                <div 
                    key={idx} 
                    onClick={() => navigate(cat.path)}
                    className={`bg-white p-4 md:p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${cat.color} group`}
                >
                    <div className="text-center">
                        <div className="bg-gray-50 w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition">
                            {cat.icon}
                        </div>
                        <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-1 md:mb-2">{cat.title}</h3>
                        <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-6 line-clamp-2 md:line-clamp-none h-8 md:h-auto">{cat.desc}</p>
                        <span className="text-green-600 font-bold text-[10px] md:text-sm flex items-center justify-center gap-1">
                            Lihat <FaArrowRight />
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* PANDUAN MITRA (2 Kolom Mobile + Teks Jelas) */}
      <div className="bg-green-50 py-10 md:py-16 border-t border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
                <span className="text-green-600 font-bold text-[10px] md:text-xs uppercase tracking-widest bg-green-100 px-3 py-1 rounded-full">Panduan Mitra</span>
                <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mt-3">Cara Bergabung</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 relative">
                <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-200 -z-10"></div>

                {steps.map((step, idx) => (
                    <div key={idx} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 text-center relative group hover:-translate-y-1 transition h-full flex flex-col items-center">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] md:text-xs font-bold w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-4 border-green-50">
                            {step.num}
                        </div>

                        <div className={`${step.color} w-10 h-10 md:w-16 md:h-16 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shrink-0`}>
                            {step.icon}
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1">{step.title}</h3>
                        {/* Teks deskripsi dibuat text-xs agar muat tapi tetap terbaca */}
                        <p className="text-xs md:text-sm text-gray-500 leading-snug">{step.desc}</p>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-8">
                <a href="https://wa.me/6281234567890" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold shadow-lg hover:bg-green-700 text-xs md:text-base transition">
                    <FaWhatsapp size={16}/> Hubungi Admin
                </a>
            </div>
        </div>
      </div>

      {/* PRODUK TERBARU (2 Kolom Mobile) */}
      <div className="bg-white py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-6">
                  <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Produk Terbaru</h2>
                  </div>
              </div>

              {loading ? (
                  <div className="text-center py-10 text-sm">Memuat...</div>
              ) : recentProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                      {recentProducts.map((product) => (
                          <div key={product.id} className="hover:-translate-y-1 transition duration-300">
                              <ProductCard 
                                product={product} 
                                isAdmin={false} 
                                onClick={() => setPreviewProduct(product)} 
                              />
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <FaBoxOpen className="text-3xl text-gray-300 mx-auto mb-2"/>
                      <p className="text-xs text-gray-500">Belum ada produk.</p>
                  </div>
              )}
          </div>
      </div>

      <ProductDetailModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
    </div>
  );
}