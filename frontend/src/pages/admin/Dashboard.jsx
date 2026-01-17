import { useEffect, useState } from "react";
import { FaStore, FaHandshake, FaBullhorn, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

// IMPORT COMPONENTS
import NavbarAdmin from "../../components/admin/NavbarAdmin"; // Pakai Navbar Admin yg baru
import HeroSlider from "../../components/common/HeroSlider"; // Pakai Slider User (agar tampilan sama)
import ProductDetailModal from "../../components/ui/ProductDetailModal"; // Modal Detail

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Ambil Data Produk
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api.get("/products")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Fungsi Hapus
  const handleDelete = async (id) => {
    if (window.confirm("Hapus produk ini?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); 
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* 1. NAVBAR ADMIN */}
      <NavbarAdmin />

      {/* 2. SLIDER (Tampilan Sama persis dengan User) */}
      {/* isAdmin={true} dikirim jika Anda ingin fitur edit slider muncul di sini */}
      <HeroSlider isAdmin={true} isHomePage={true} />

      {/* 3. DESKRIPSI WEBSITE (Sama seperti User) */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
            <span className="text-green-600 font-bold tracking-wider text-xs md:text-sm mb-2 block uppercase">
                Panel Admin
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Kelola Lembaga Ekonomi Tiyuh
            </h2>
            <p className="max-w-3xl mx-auto text-gray-500 text-sm md:text-base leading-relaxed">
               Selamat datang di dashboard pengelolaan. Di sini Anda dapat mengelola data BUMDes, UMKM, dan Koperasi.
               Pastikan data yang dimasukkan valid agar tampilan di halaman User maksimal.
            </p>
        </div>
      </section>

      {/* 4. SHORTCUT KATEGORI */}
      <section className="py-8 max-w-7xl mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <FaStore className="text-4xl text-green-600 mb-2" />
                <h3 className="font-bold text-lg">Kelola BUMDes</h3>
                <button onClick={() => navigate("/admin/bumdes")} className="mt-2 text-xs bg-green-50 text-green-600 px-3 py-1 rounded font-bold">Buka</button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <FaHandshake className="text-4xl text-blue-600 mb-2" />
                <h3 className="font-bold text-lg">Kelola Koperasi</h3>
                <button onClick={() => navigate("/admin/koperasi")} className="mt-2 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Buka</button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <FaBullhorn className="text-4xl text-orange-600 mb-2" />
                <h3 className="font-bold text-lg">Kelola UMKM</h3>
                <button onClick={() => navigate("/admin/umkm")} className="mt-2 text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded font-bold">Buka</button>
            </div>
         </div>
      </section>

      {/* 5. DAFTAR PRODUK */}
      <section className="py-8 max-w-7xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 border-l-4 border-green-600 pl-4">
                Daftar Semua Produk
            </h2>
            <button 
                onClick={() => navigate("/admin/add-product")}
                className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow hover:bg-green-700 flex items-center gap-2"
            >
                <FaPlus /> Tambah Produk
            </button>
        </div>

        {loading ? (
             <div className="text-center py-10">Memuat data...</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div 
                        className="h-40 bg-gray-100 relative cursor-pointer"
                        onClick={() => setSelectedProduct(item)}
                    >
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-gray-700">
                            {item.category?.name}
                        </div>
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1">{item.product_name}</h3>
                        <p className="text-xs text-gray-500 mb-3">{item.business_name}</p>
                        
                        {/* TOMBOL EDIT & HAPUS */}
                        <div className="mt-auto flex gap-2 pt-2 border-t border-gray-100">
                            <button 
                                onClick={() => navigate(`/admin/edit-product/${item.id}`)}
                                className="flex-1 bg-yellow-50 text-yellow-600 py-1.5 rounded text-xs font-bold hover:bg-yellow-100 flex items-center justify-center gap-1"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-1"
                            >
                                <FaTrash /> Hapus
                            </button>
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