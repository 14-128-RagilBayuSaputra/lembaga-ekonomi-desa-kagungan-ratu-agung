import { useState, useEffect } from "react";
import { FaTimes, FaCloudUploadAlt, FaToggleOn, FaToggleOff, FaSave, FaInstagram, FaFacebook, FaWhatsapp, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function ProductFormModal({ isOpen, onClose, editData, onSuccess, categoryContext }) {
  const [loading, setLoading] = useState(false);
  
  // --- STATE MANAGEMENT ---
  const [newImages, setNewImages] = useState([]);     // File Asli (Upload Baru)
  const [newPreviews, setNewPreviews] = useState([]); // URL Preview (Upload Baru)
  
  const [existingImages, setExistingImages] = useState([]); // Gambar Lama dari DB
  const [deletedIds, setDeletedIds] = useState([]);         // ID Gambar Lama yang mau DIHAPUS

  // Config Endpoint
  const API_ENDPOINT = "/admin/products";

  const initialForm = {
    product_name: "", business_name: "", price: "", description: "",
    category_id: categoryContext || "1",
    maps_url: "", whatsapp_url: "", instagram_url: "", facebook_url: "",
    is_active: true,
  };
  const [formData, setFormData] = useState(initialForm);

  // --- 1. SETUP DATA SAAT BUKA MODAL ---
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // Mode Edit: Isi form
        setFormData({
            product_name: editData.product_name || "",
            business_name: editData.business_name || "",
            price: editData.price || "",
            description: editData.description || "",
            category_id: editData.category_id || editData.category?.id || "1",
            maps_url: editData.maps_url || "",
            whatsapp_url: editData.whatsapp_url || "",
            instagram_url: editData.instagram_url || "",
            facebook_url: editData.facebook_url || "",
            is_active: editData.is_active !== undefined ? editData.is_active : true,
        });
        
        // Mode Edit: Pisahkan gambar lama
        // Kita butuh ID untuk menghapus, jadi simpan object {id, image_url}
        let oldImgs = [];
        if (editData.images && Array.isArray(editData.images)) {
            oldImgs = [...editData.images]; // Salin array gallery
        }
        // Jika ada cover image terpisah dan belum ada di gallery, bisa ditangani khusus
        // Tapi biasanya sistem Anda sudah memasukkannya ke gallery atau cover image diganti lewat upload baru
        
        setExistingImages(oldImgs);
        setDeletedIds([]); // Reset antrian hapus
        
        // Reset upload baru
        setNewImages([]);
        setNewPreviews([]);

      } else {
        // Mode Tambah
        setFormData(initialForm);
        setExistingImages([]);
        setDeletedIds([]);
        setNewImages([]);
        setNewPreviews([]);
      }
    }
  }, [isOpen, editData]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleToggleActive = () => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));

  // --- 2. HANDLER GAMBAR BARU (UPLOAD) ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        setNewImages((prev) => [...prev, ...files]);
        const newUrls = files.map(file => URL.createObjectURL(file));
        setNewPreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const removeNewImage = (index) => {
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 3. HANDLER GAMBAR LAMA (DELETE DATABASE) ---
  const removeExistingImage = (id) => {
      // 1. Masukkan ID ke antrian hapus
      setDeletedIds((prev) => [...prev, id]);
      // 2. Hilangkan dari tampilan modal
      setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  // --- 4. SUBMIT (SIMPAN & HAPUS) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // A. EKSEKUSI PENGHAPUSAN FOTO LAMA (Jika ada yang dihapus)
      if (editData && deletedIds.length > 0) {
          // Kita loop request delete ke backend untuk setiap ID yang dibuang
          await Promise.all(deletedIds.map(id => api.delete(`${API_ENDPOINT}/image/${id}`)));
      }

      // B. PERSIAPAN DATA BARU
      const submitData = new FormData();
      
      // Data Teks
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Data Gambar Baru
      if (newImages.length > 0) {
          newImages.forEach((file) => {
              submitData.append("images", file); 
          });
      }

      // C. KIRIM REQUEST UTAMA (PUT/POST)
      if (editData) {
        await api.put(`${API_ENDPOINT}/${editData.id}`, submitData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Produk diperbarui!");
      } else {
        await api.post(API_ENDPOINT, submitData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Produk berhasil ditambahkan!");
      }

      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error("Error submit:", error);
      if(error.response?.status === 404) toast.error("Endpoint Salah (404).");
      else toast.error(error.response?.data?.message || "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md md:max-w-lg shadow-2xl relative my-auto flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-5 py-3 border-b flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
          <h3 className="font-bold text-base text-gray-800">
            {editData ? "Edit Produk" : "Tambah Produk"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition bg-white rounded-full p-1 shadow-sm">
            <FaTimes size={14} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* AREA UPLOAD & PREVIEW */}
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-gray-400 uppercase">Foto Produk</label>
             <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                 
                 {/* 1. TOMBOL UPLOAD */}
                 <div className="w-20 h-20 bg-gray-50 rounded-lg border-2 border-dashed border-green-300 flex items-center justify-center relative shrink-0 hover:bg-green-50 transition cursor-pointer group">
                    <div className="text-center">
                        <FaCloudUploadAlt className="text-green-400 text-xl mx-auto group-hover:scale-110 transition"/>
                        <span className="text-[9px] text-green-600 font-bold block mt-1">+ Foto</span>
                    </div>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>

                 {/* 2. PREVIEW GAMBAR LAMA (Dari Database) */}
                 {existingImages.map((img) => (
                     <div key={img.id} className="w-20 h-20 rounded-lg border border-blue-200 relative shrink-0 overflow-hidden group">
                         <img src={img.image_url} alt="Old" className="w-full h-full object-cover" />
                         {/* Badge 'Lama' */}
                         <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-[8px] text-center font-bold">Tersimpan</span>
                         
                         {/* Tombol Hapus (Queue Delete) */}
                         <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition shadow-md">
                            <FaTrash size={10} />
                         </button>
                     </div>
                 ))}

                 {/* 3. PREVIEW GAMBAR BARU (Uploadan User) */}
                 {newPreviews.map((src, idx) => (
                     <div key={`new-${idx}`} className="w-20 h-20 rounded-lg border border-green-200 relative shrink-0 overflow-hidden group">
                         <img src={src} alt="New" className="w-full h-full object-cover" />
                         {/* Badge 'Baru' */}
                         <span className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-[8px] text-center font-bold">Baru</span>

                         {/* Tombol Hapus (Cancel Upload) */}
                         <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition shadow-md">
                            <FaTimes size={10} />
                         </button>
                     </div>
                 ))}
             </div>
             {deletedIds.length > 0 && (
                 <p className="text-[10px] text-red-500 italic">* {deletedIds.length} foto lama akan dihapus permanen saat tombol Simpan ditekan.</p>
             )}
          </div>

          <hr className="border-gray-100"/>

          {/* INPUT FIELDS (Tetap Sama) */}
          <div className="space-y-2">
             <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
                <span className="text-xs font-bold text-gray-600">Status</span>
                <button type="button" onClick={handleToggleActive} className="flex items-center gap-2">
                   <span className={`text-[10px] font-bold ${formData.is_active ? "text-green-600" : "text-gray-400"}`}>{formData.is_active ? "Aktif" : "Nonaktif"}</span>
                   {formData.is_active ? <FaToggleOn size={20} className="text-green-600"/> : <FaToggleOff size={20} className="text-gray-400"/>}
                </button>
             </div>
             <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none" placeholder="Nama Produk *" />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" placeholder="Nama Pemilik *" />
             <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" placeholder="Harga (Rp)" />
          </div>

          <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none resize-none" placeholder="Deskripsi produk..."></textarea>

          {/* SOCIAL LINKS */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
             <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sosial Media & Lokasi</p>
             <div className="grid grid-cols-2 gap-2">
                 <div className="relative"><FaWhatsapp className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-500 text-sm"/><input type="text" name="whatsapp_url" value={formData.whatsapp_url} onChange={handleChange} className="w-full pl-8 pr-2 py-1.5 border rounded text-xs outline-none focus:border-green-500" placeholder="WhatsApp" /></div>
                 <div className="relative"><FaMapMarkerAlt className="absolute left-2.5 top-1/2 -translate-y-1/2 text-red-500 text-sm"/><input type="text" name="maps_url" value={formData.maps_url} onChange={handleChange} className="w-full pl-8 pr-2 py-1.5 border rounded text-xs outline-none focus:border-red-500" placeholder="Google Maps" /></div>
                 <div className="relative"><FaInstagram className="absolute left-2.5 top-1/2 -translate-y-1/2 text-pink-500 text-sm"/><input type="text" name="instagram_url" value={formData.instagram_url} onChange={handleChange} className="w-full pl-8 pr-2 py-1.5 border rounded text-xs outline-none focus:border-pink-500" placeholder="Instagram" /></div>
                 <div className="relative"><FaFacebook className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-600 text-sm"/><input type="text" name="facebook_url" value={formData.facebook_url} onChange={handleChange} className="w-full pl-8 pr-2 py-1.5 border rounded text-xs outline-none focus:border-blue-600" placeholder="Facebook" /></div>
             </div>
          </div>
          
          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg font-bold text-white shadow-md bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 text-sm transition">
              {loading ? "Menyimpan..." : <><FaSave/> {editData ? "Simpan Perubahan" : "Terbitkan Produk"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}