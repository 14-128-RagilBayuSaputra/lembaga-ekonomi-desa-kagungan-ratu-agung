import { useEffect, useState } from "react";
import { FaPlus, FaBoxOpen, FaSearch, FaLeaf } from "react-icons/fa";
import Swal from "sweetalert2"; 
import api from "../../api/axios";
import toast from "react-hot-toast";

import NavbarAdmin from "./NavbarAdmin"; 
import HeroSlider from "../common/HeroSlider";
import ProductCard from "../ui/ProductCard";
import ProductFormModal from "./ProductFormModal";
import ProductDetailModal from "../ui/ProductDetailModal"; 
import SkeletonCard from "../ui/SkeletonCard"; 

export default function AdminProductManager({ title, categoryId, description }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null); 

  // --- LOGIC FETCH ---
  const fetchProducts = () => {
    setLoading(true);
    // PERBAIKAN 1: Gunakan endpoint ADMIN agar konsisten
    api.get("/admin/products") 
      .then((res) => {
        const allProducts = res.data.data || [];
        // Filter berdasarkan kategori halaman saat ini (BUMDes/UMKM/Koperasi)
        const filtered = allProducts.filter(p => 
            p.category_id === categoryId || p.category?.id === categoryId
        );
        setProducts(filtered);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal memuat data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [categoryId]);

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => { setEditData(null); setIsModalOpen(true); };
  const handleEditClick = (product) => { setEditData(product); setIsModalOpen(true); };
  
  // --- LOGIC DELETE ---
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
        title: 'Hapus Produk?',
        text: "Data tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
        try { 
            // PERBAIKAN 2: Tambahkan '/admin' di URL delete
            await api.delete(`/admin/products/${id}`); 
            
            Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success');
            fetchProducts(); // Refresh data
        } catch (e) { 
            console.error(e);
            Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/50 pb-20 font-sans text-gray-800">
      
      <NavbarAdmin /> 
      
      <div className="relative mb-8"> 
         <HeroSlider isAdmin={true} />
         
         <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-3">
                    <FaLeaf />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Kelola <span className="text-green-600">{title}</span>
                </h1>
                <div className="w-16 h-1 bg-green-200 mx-auto mb-4 rounded-full"></div>
                <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
                    {description || `Kelola data produk ${title} dengan mudah. Pastikan informasi akurat untuk menarik minat pembeli.`}
                </p>
            </div>
         </div>
      </div>

      {/* SEARCH & ADD BUTTON */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
                
                <div className="flex items-center gap-2 text-gray-600 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    <FaBoxOpen className="text-green-500"/>
                    Total Produk: <span className="text-gray-900">{products.length}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Cari produk ${title}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm transition"
                        />
                    </div>
                    
                    <button 
                        onClick={handleAddClick}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <FaPlus /> Tambah Produk
                    </button>
                </div>
            </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
        ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/80 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FaSearch className="text-3xl text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Tidak ada produk ditemukan</h3>
                <p className="text-gray-500 text-sm mb-4">Coba kata kunci lain atau tambahkan produk baru.</p>
                {!searchTerm && (
                    <button onClick={handleAddClick} className="text-green-600 font-bold hover:underline">Tambah Produk Pertama</button>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((item) => (
                    <div key={item.id} className="transform transition duration-300 hover:-translate-y-1">
                        <ProductCard 
                            product={item}
                            isAdmin={true}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            onClick={() => setPreviewProduct(item)} 
                        />
                    </div>
                ))}
            </div>
        )}
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}        
        onSuccess={fetchProducts}  
        categoryContext={categoryId} 
      />

      <ProductDetailModal 
        product={previewProduct} 
        onClose={() => setPreviewProduct(null)} 
      />
    </div>
  );
}