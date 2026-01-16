import { useState, useEffect } from "react";
import { FaTimes, FaCloudUploadAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../api/axios"; // Sesuaikan path api Anda

export default function ProductFormModal({ isOpen, onClose, editData, onSuccess, categoryContext }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Initial Form State
  const initialForm = {
    product_name: "",
    business_name: "",
    price: "",
    description: "",
    category_id: "", // Nanti diisi dropdown atau otomatis dari context
    maps_url: "",
    whatsapp_url: "",
    is_active: true, // Default aktif
  };

  const [formData, setFormData] = useState(initialForm);

  // Efek saat modal dibuka (Mode Edit vs Tambah)
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // Mode Edit: Isi form dengan data yang ada
        setFormData({
            ...editData,
            price: editData.price || "",
            category_id: editData.category?.id || "" // Asumsi struktur data
        });
        setImagePreview(editData.image_url);
      } else {
        // Mode Tambah: Reset form
        setFormData(initialForm);
        setImagePreview(null);
        setImageFile(null);
        // Jika sedang di halaman spesifik (misal UMKM), otomatis set kategorinya
        if(categoryContext) {
            // Anda perlu logika untuk mendapatkan ID kategori berdasarkan nama context
            // setFormData(prev => ({...prev, category_id: ID_UMKM})) 
        }
      }
    }
  }, [isOpen, editData, categoryContext]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  // Handle File Gambar (Preview sebelum upload)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Siapkan FormData untuk upload file (jika backend pakai multipart/form-data)
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      // 2. Tentukan Endpoint dan Method
      let response;
      if (editData) {
        // Mode Edit (PUT)
        response = await api.put(`/products/${editData.id}`, submitData);
        toast.success("Produk berhasil diperbarui!");
      } else {
        // Mode Tambah (POST)
        response = await api.post("/products", submitData);
        toast.success("Produk berhasil ditambahkan!");
      }

      onSuccess(response.data); // Refresh data di halaman induk
      onClose(); // Tutup modal
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h3 className="font-bold text-xl text-desa-dark">
            {editData ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-desa-danger transition">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* --- Status Toggle --- */}
          <div className="flex items-center justify-between bg-desa-light p-3 rounded-lg border border-green-100">
            <span className="font-medium text-desa-dark">Status Publikasi</span>
            <button type="button" onClick={handleToggleActive} className="flex items-center gap-2 focus:outline-none">
               <span className={`text-sm ${formData.is_active ? "text-desa-primary" : "text-gray-500"}`}>
                 {formData.is_active ? "Aktif (Ditampilkan)" : "Non-Aktif (Disembunyikan)"}
               </span>
               {formData.is_active ? 
                 <FaToggleOn size={28} className="text-desa-primary"/> : 
                 <FaToggleOff size={28} className="text-gray-400"/>
               }
            </button>
          </div>

          {/* --- Image Upload --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
            <div className="flex items-center gap-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <FaCloudUploadAlt className="text-gray-400 text-3xl" />
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="text-sm text-gray-500">
                    <p>Klik kotak untuk unggah.</p>
                    <p>Format: JPG, PNG. Maks 2MB.</p>
                </div>
            </div>
          </div>

          {/* --- Basic Info --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="form-label">Nama Produk <span className="text-red-500">*</span></label>
                <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} required className="form-input" placeholder="Contoh: Keripik Pisang Jaya" />
            </div>
            <div>
                <label className="form-label">Nama Usaha/Pemilik <span className="text-red-500">*</span></label>
                <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} required className="form-input" placeholder="Contoh: Ibu Siti Aminah" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Di sini sebaiknya ada Dropdown Kategori jika halaman ini general */}
             {/* <div>Letak Dropdown Kategori</div> */}
            <div>
                <label className="form-label">Harga (Opsional)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input" placeholder="Contoh: 15000" />
            </div>
          </div>

           <div>
                <label className="form-label">Deskripsi Lengkap</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="form-input" placeholder="Jelaskan keunggulan produk..."></textarea>
           </div>

           {/* --- Links --- */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="form-label">Link Google Maps (Opsional)</label>
                <input type="url" name="maps_url" value={formData.maps_url} onChange={handleChange} className="form-input" placeholder="https://goo.gl/maps/..." />
            </div>
            <div>
                <label className="form-label">Link WhatsApp (Opsional)</label>
                <input type="url" name="whatsapp_url" value={formData.whatsapp_url} onChange={handleChange} className="form-input" placeholder="https://wa.me/628..." />
            </div>
           </div>
          
          {/* --- Submit Button --- */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition items-center justify-center flex gap-2 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-desa-primary hover:bg-desa-dark hover:-translate-y-1"
              }`}
            >
              {loading ? "Menyimpan..." : (editData ? "Simpan Perubahan" : "Terbitkan Produk")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tambahkan CSS kecil ini di index.css Anda untuk class `form-label` dan `form-input` agar lebih rapi
/*
@layer components {
  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  .form-input {
    @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-desa-primary focus:border-transparent outline-none transition;
  }
}
*/