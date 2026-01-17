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
    api.get("/admin/products") 
      .then((res) => {
        const allProducts = res.data.data || [];
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
  
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
        title: 'Hapus?',
        text: "Data tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Hapus!'
    });

    if (result.isConfirmed) {
        try { 
            await api.delete(`/admin/products/${id}`); 
            Swal.fire('Terhapus!', 'Produk dihapus.', 'success');
            fetchProducts(); 
        } catch (e) { 
            console.error(e);
            Swal.fire('Gagal', 'Terjadi kesalahan.', 'error');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/50 pb-20 font-sans text-gray-800">
      
      <NavbarAdmin /> 
      
      <div className="relative mb-8 md:mb-12"> 
         <HeroSlider isAdmin={true} />
         
         {/* KARTU JUDUL HALAMAN (Responsive) */}
         <div className="max-w-5xl mx-auto px-4 -mt-12 md:-mt-16 relative z-40">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-green-500 text-center animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 text-green-600 rounded-full mb-2 md:mb-3">
                    <FaLeaf className="text-sm md:text-base"/>
                </div>
                <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-1 md:mb-2">
                    Kelola <span className="text-green-600">{title}</span>
                </h1>
                <p className="text-xs md:text-base text-gray-500 mt-1 max-w-2xl mx-auto leading-relaxed">
                    {description || `Kelola data produk ${title} dengan mudah.`}
                </p>
            </div>
         </div>
      </div>

      {/* SEARCH & ADD BUTTON */}
      <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-white/50 shadow-sm">
                
                <div className="flex items-center gap-2 text-gray-600 font-semibold bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 w-full md:w-auto text-xs md:text-sm">
                    <FaBoxOpen className="text-green-500"/>
                    Total: <span className="text-gray-900 font-bold">{products.length} Produk</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Cari produk ${title}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none shadow-sm transition text-xs md:text-sm"
                        />
                    </div>
                    
                    <button 
                        onClick={handleAddClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 md:py-2.5 rounded-lg font-bold shadow-md flex items-center justify-center gap-2 text-xs md:text-sm transition"
                    >
                        <FaPlus /> Tambah
                    </button>
                </div>
            </div>
      </div>

      {/* PRODUCT GRID ADMIN - 2 KOLOM DI MOBILE */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
        ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white/80 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaSearch className="text-2xl text-gray-300" />
                </div>
                <h3 className="text-sm font-bold text-gray-700">Tidak ada produk</h3>
                <p className="text-gray-500 text-xs mb-3">Tambahkan produk baru sekarang.</p>
                {!searchTerm && (
                    <button onClick={handleAddClick} className="text-green-600 font-bold hover:underline text-xs">Tambah Produk</button>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {filteredProducts.map((item) => (
                    <div key={item.id} className="hover:-translate-y-1 transition duration-300">
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