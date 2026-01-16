import { useEffect, useState } from "react";
import { FaPlus, FaBoxOpen, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2"; // IMPORT SWEETALERT2
import api from "../../api/axios";
import toast from "react-hot-toast";

// Import Komponen
import AdminNavbar from "./AdminNavbar"; 
import HeroSlider from "../common/HeroSlider";
import ProductCard from "../ui/ProductCard";
import ProductFormModal from "./ProductFormModal";
import ProductDetailModal from "../ui/ProductDetailModal"; // IMPORT MODAL DETAIL UNTUK PREVIEW
import SkeletonCard from "../ui/SkeletonCard"; 

export default function AdminProductManager({ title, categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Pencarian, Modal, & Preview
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null); // STATE UNTUK PREVIEW

  // === 1. FETCH DATA ===
  const fetchProducts = () => {
    setLoading(true);
    api.get("/products") 
      .then((res) => {
        const allProducts = res.data.data || [];
        const filtered = allProducts.filter(p => 
            p.category_id === categoryId || p.category?.id === categoryId
        );
        setProducts(filtered);
      })
      .catch((err) => {
        toast.error("Gagal memuat data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [categoryId]);

  // === 2. FILTER PENCARIAN ===
  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === 3. HANDLERS ===
  const handleAddClick = () => { setEditData(null); setIsModalOpen(true); };
  const handleEditClick = (product) => { setEditData(product); setIsModalOpen(true); };
  
  // HANDLER HAPUS DENGAN SWEETALERT2
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: "Data produk ini tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try { 
            await api.delete(`/admin/products/${id}`); 
            // Feedback Sukses
            Swal.fire(
                'Terhapus!',
                'Produk telah dihapus.',
                'success'
            );
            fetchProducts(); 
        } catch (e) { 
            Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
        }
    }
  };

  // === 4. RENDER TAMPILAN ===
  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <AdminNavbar /> 
      
      {/* Header + Search Bar */}
      <div className="relative mb-24"> 
         <HeroSlider isAdmin={true} />
         
         <div className="absolute -bottom-16 left-0 right-0 px-4 md:px-8 z-20">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800">Admin {title}</h1>
                        <p className="text-gray-500 text-sm">{products.length} Produk Terdaftar</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* SEARCH INPUT */}
                        <div className="relative w-full sm:w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari nama produk..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                            />
                        </div>

                        {/* ADD BUTTON */}
                        <button 
                            onClick={handleAddClick}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <FaPlus /> Tambah Produk
                        </button>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
            // SKELETON LOADING
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
        ) : filteredProducts.length === 0 ? (
            // EMPTY STATE
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3"/>
                <p className="text-gray-500">
                    {searchTerm ? `Tidak ditemukan produk "${searchTerm}"` : `Belum ada produk di kategori ${title}.`}
                </p>
                {!searchTerm && (
                    <button onClick={handleAddClick} className="text-green-600 font-bold hover:underline mt-2">Tambah Sekarang</button>
                )}
            </div>
        ) : (
            // PRODUCT GRID
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((item) => (
                    <ProductCard 
                        key={item.id} 
                        product={item}
                        isAdmin={true}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        // KLIK CARD -> BUKA PREVIEW
                        onClick={() => setPreviewProduct(item)} 
                    />
                ))}
            </div>
        )}
      </div>

      {/* MODAL FORM (Edit/Add) */}
      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}        
        onSuccess={fetchProducts}  
        categoryContext={categoryId} 
      />

      {/* MODAL PREVIEW (Read Only) */}
      <ProductDetailModal 
        product={previewProduct} 
        onClose={() => setPreviewProduct(null)} 
      />
    </div>
  );
}