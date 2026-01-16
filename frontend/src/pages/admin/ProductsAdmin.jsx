import { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import api from "../../api/axios";

// Components Reused
import HeroSlider from "../../components/common/HeroSlider";
import ProductCard from "../../components/ui/ProductCard";
import AdminNavbar from "../../components/admin/AdminNavbar"; // Asumsi Anda punya ini, atau pakai Navbar biasa

export default function ProductsAdmin({ title, category }) {
  // State Data
  const [products, setProducts] = useState([]);
  
  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    product_name: "",
    business_name: "",
    price: "",
    description: "",
    image_url: "", // Asumsi handle upload terpisah atau input link dulu
    maps_url: "",
    whatsapp_url: ""
  });

  // --- FETCH DATA ---
  const fetchProducts = () => {
    api.get("/admin/products") // Pastikan endpoint ini return semua produk
      .then((res) => {
        // Filter sesuai kategori halaman (BUMDes/UMKM/Koperasi)
        const filtered = res.data.data.filter(
          (p) => p.category?.name?.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // --- HANDLERS SLIDER ---
  const handleAddSlider = () => {
    alert("Fitur Tambah Slider: Implementasikan modal upload slider disini.");
    // Logika: Buka modal upload gambar slider -> POST /sliders
  };

  const handleDeleteSlider = (id) => {
    if(!confirm("Hapus slider ini?")) return;
    api.delete(`/sliders/${id}`)
       .then(() => alert("Slider dihapus!")) // Refresh slider logic needed inside HeroSlider component typically
       .catch(() => alert("Gagal hapus"));
  };

  // --- HANDLERS PRODUCT ---
  const openAddModal = () => {
    setForm({ product_name: "", business_name: "", price: "", description: "", image_url: "", maps_url: "", whatsapp_url: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setForm({
        product_name: product.product_name,
        business_name: product.business_name,
        price: product.price || "",
        description: product.description || "",
        image_url: product.image_url || "",
        maps_url: product.maps_url || "",
        whatsapp_url: product.whatsapp_url || ""
    });
    setCurrentId(product.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
        await api.delete(`/admin/products/${id}`); // Sesuaikan endpoint delete
        fetchProducts();
    } catch (err) {
        alert("Gagal menghapus produk");
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
        const payload = { ...form, category, price: Number(form.price) };
        
        if (isEditing) {
            await api.put(`/admin/products/${currentId}`, payload);
        } else {
            await api.post("/admin/products", payload);
        }
        
        setIsModalOpen(false);
        fetchProducts();
        alert(isEditing ? "Produk diperbarui!" : "Produk berhasil ditambah!");
    } catch (error) {
        console.error(error);
        alert("Gagal menyimpan data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Jika pakai layout khusus admin, bungkus di sini */}
      <AdminNavbar /> 

      {/* 1. HERO SECTION (ADMIN MODE) */}
      <div className="relative">
        <HeroSlider 
            isAdmin={true} 
            onAddClick={handleAddSlider} 
            onDeleteClick={handleDeleteSlider} 
        />
        
        {/* Judul Halaman Overlay */}
        <div className="absolute -bottom-10 left-0 right-0 px-6">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola {title}</h1>
                    <p className="text-gray-500 text-sm">Anda login sebagai Administrator</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="bg-desa-primary hover:bg-desa-dark text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 transition"
                >
                    <FaPlus /> Tambah Produk
                </button>
            </div>
        </div>
      </div>

      {/* 2. LIST PRODUK (ADMIN MODE) */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <p>Belum ada produk di kategori ini.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {products.map((p) => (
                    <ProductCard 
                        key={p.id} 
                        product={p}
                        isAdmin={true} // Aktifkan tombol edit/hapus
                        onEdit={openEditModal}
                        onDelete={handleDeleteProduct}
                        onClick={() => {}} // Admin klik card tidak perlu buka detail
                    />
                ))}
            </div>
        )}
      </div>

      {/* 3. MODAL FORM ADD/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">
                        {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                        <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-desa-primary outline-none" 
                            value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Usaha</label>
                            <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-desa-primary outline-none" 
                                value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                            <input type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-desa-primary outline-none" 
                                value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                        <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-desa-primary outline-none" 
                            placeholder="https://..." value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
                        <p className="text-xs text-gray-400 mt-1">*Fitur upload gambar sebaiknya menggunakan input type file terpisah.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-desa-primary outline-none" rows="3"
                            value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
                    </div>

                    <button type="submit" className="w-full bg-desa-primary text-white font-bold py-3 rounded-lg hover:bg-desa-dark transition shadow-lg">
                        {isEditing ? "Simpan Perubahan" : "Terbitkan Produk"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}