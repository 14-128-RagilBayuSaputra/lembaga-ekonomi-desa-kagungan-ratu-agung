import { useEffect, useState } from "react";
import { FaStore, FaHandshake, FaBullhorn } from "react-icons/fa";
import api from "../../api/axios";
import toast from "react-hot-toast";

// === PENTING: Ganti import Navbar User jadi AdminNavbar ===
import AdminNavbar from "../../components/admin/AdminNavbar"; 
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import ProductFormModal from "../../components/admin/ProductFormModal";

export default function AdminHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchRecentProducts = () => {
    setLoading(true);
    api.get("/products") 
      .then((res) => {
        const data = res.data.data || [];
        setProducts(data.slice(0, 8));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecentProducts(); }, []);

  const handleEditProduct = (product) => {
    setEditData(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if(!confirm("Yakin hapus produk ini?")) return;
    try {
        await api.delete(`/admin/products/${id}`);
        toast.success("Produk dihapus");
        fetchRecentProducts();
    } catch(e) { toast.error("Gagal menghapus"); }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 pb-20">
      {/* === GUNAKAN ADMIN NAVBAR DISINI === */}
      <AdminNavbar />
      
      {/* Slider & Konten lainnya */}
      <HeroSlider isAdmin={true} isHomePage={true} />

      <section className="py-16 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="text-green-600 font-bold tracking-wider text-sm mb-2 block">DASHBOARD ADMIN</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Kelola Lembaga Ekonomi Desa</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12 opacity-80">
                <div className="p-6 bg-gray-50 rounded-2xl"><FaStore className="text-3xl text-green-600 mx-auto mb-2"/><h3 className="font-bold">BUMDes</h3></div>
                <div className="p-6 bg-gray-50 rounded-2xl"><FaHandshake className="text-3xl text-green-600 mx-auto mb-2"/><h3 className="font-bold">Koperasi</h3></div>
                <div className="p-6 bg-gray-50 rounded-2xl"><FaBullhorn className="text-3xl text-green-600 mx-auto mb-2"/><h3 className="font-bold">UMKM</h3></div>
            </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Produk Terbaru</h2>
        {loading ? <p>Memuat...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
                <ProductCard
                    key={item.id} product={item} isAdmin={true}
                    onEdit={handleEditProduct} onDelete={handleDeleteProduct} onClick={() => {}}
                />
            ))}
            </div>
        )}
      </section>

      <ProductFormModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        editData={editData} onSuccess={fetchRecentProducts}
      />
    </div>
  );
}