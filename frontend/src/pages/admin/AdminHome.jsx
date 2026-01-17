import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStore, FaHandshake, FaBullhorn, FaArrowRight, FaBoxOpen, FaLeaf } from "react-icons/fa";
import api from "../../api/axios";

import NavbarAdmin from "../../components/admin/NavbarAdmin";
import HeroSlider from "../../components/common/HeroSlider";

export default function AdminHome() {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    api.get("/products") // Endpoint public untuk preview
      .then((res) => {
        const all = res.data.data || [];
        setRecentProducts(all.slice(0, 4));
      })
      .catch((err) => console.error(err));
  }, []);

  const menus = [
    {
      title: "Kelola BUMDes",
      subtitle: "Pendapatan Asli Desa",
      path: "/admin/bumdes",
      icon: <FaStore className="text-xl md:text-3xl" />, // Icon lebih kecil di HP
      color: "green",
      shadow: "hover:shadow-green-200",
      bgIcon: "bg-green-100",
      textIcon: "text-green-600",
      borderColor: "hover:border-green-300"
    },
    {
      title: "Kelola Koperasi",
      subtitle: "Kesejahteraan Anggota",
      path: "/admin/koperasi",
      icon: <FaHandshake className="text-xl md:text-3xl" />,
      color: "blue",
      shadow: "hover:shadow-blue-200",
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
      borderColor: "hover:border-blue-300"
    },
    {
      title: "Kelola UMKM",
      subtitle: "Ekonomi Kreatif Warga",
      path: "/admin/umkm",
      icon: <FaBullhorn className="text-xl md:text-3xl" />,
      color: "orange",
      shadow: "hover:shadow-orange-200",
      bgIcon: "bg-orange-100",
      textIcon: "text-orange-600",
      borderColor: "hover:border-orange-300"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
      
      <NavbarAdmin />

      {/* HERO SECTION */}
      <div className="relative mb-8 md:mb-12">
        <HeroSlider isAdmin={true} isHomePage={true} />
        
        {/* KARTU WELCOME (Responsive Padding & Margin) */}
        <div className="max-w-5xl mx-auto px-4 -mt-12 md:-mt-16 relative z-40">
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 text-center border-b-4 border-green-500 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 text-green-600 rounded-full mb-2 md:mb-3">
                    <FaLeaf className="text-sm md:text-base"/>
                </div>
                <h1 className="text-lg md:text-3xl font-extrabold text-gray-900 mb-1 md:mb-2">
                    Panel Admin <span className="text-green-600">Terpadu</span>
                </h1>
                <p className="text-xs md:text-base text-gray-500 mt-1 max-w-2xl mx-auto leading-relaxed">
                    Kelola potensi <b>BUMDes, UMKM, dan Koperasi</b> secara efisien.
                </p>
            </div>
        </div>
      </div>

      {/* MENU KATEGORI - Grid 2 Kolom di Mobile */}
      <div className="max-w-7xl mx-auto px-4 mb-8 md:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {menus.map((item, index) => (
                <div 
                    key={index}
                    onClick={() => navigate(item.path)}
                    // Padding kecil di mobile (p-4)
                    className={`
                        bg-white rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer group relative overflow-hidden
                        border border-gray-100 transition-all duration-300 ease-in-out
                        shadow-sm hover:shadow-xl hover:-translate-y-2
                        ${item.shadow} ${item.borderColor}
                    `}
                >
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110 ${item.bgIcon} ${item.textIcon}`}>
                            {item.icon}
                        </div>
                        <h3 className="text-xs md:text-lg font-bold text-gray-800 group-hover:text-gray-900">{item.title}</h3>
                        <p className="text-[10px] md:text-sm text-gray-500 mb-2 md:mb-4 line-clamp-1 md:line-clamp-none">{item.subtitle}</p>
                        <span className={`text-[9px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 ${item.textIcon}`}>
                            Buka <FaArrowRight />
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* PREVIEW PRODUK - Grid 2 Kolom di Mobile */}
      <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4 md:mb-6 pl-2 border-l-4 border-green-600">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Preview Produk</h2>
              <span className="text-[10px] md:text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Live</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
                          <div className="h-32 md:h-40 bg-gray-100 relative">
                              <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold text-gray-700 shadow-sm">
                                  {product.category?.name}
                              </div>
                          </div>
                          <div className="p-3 md:p-4 flex-1 flex flex-col">
                              <h4 className="font-bold text-gray-800 text-xs md:text-sm line-clamp-1">{product.product_name}</h4>
                              <p className="text-[10px] md:text-xs text-gray-500 mb-2 flex items-center gap-1"><FaStore className="text-gray-300"/> <span className="truncate w-20">{product.business_name}</span></p>
                              <div className="mt-auto pt-2 border-t border-gray-50 flex justify-between items-center">
                                  <span className="text-xs md:text-sm font-bold text-green-600">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)}
                                  </span>
                              </div>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                      <FaBoxOpen className="mx-auto text-3xl mb-2 opacity-50"/>
                      <p>Belum ada produk yang diupload.</p>
                  </div>
              )}
          </div>
      </div>

    </div>
  );
}