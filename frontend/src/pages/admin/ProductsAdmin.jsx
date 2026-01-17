import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaArrowLeft, FaImage } from "react-icons/fa";
import api from "../../api/axios";
import NavbarAdmin from "../../components/admin/NavbarAdmin"; // Pakai Navbar Admin

export default function EditProduct() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [form, setForm] = useState({
    product_name: "",
    business_name: "",
    category_id: "1",
    price: "",
    description: "",
    whatsapp_url: "",
    instagram_url: "",
    maps_url: "",
    image_url: "" // URL gambar lama
  });

  // State untuk File Gambar Baru (Jika diganti)
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 1. Ambil Data Produk Lama saat halaman dibuka
  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        const data = res.data.data;
        setForm({
            product_name: data.product_name,
            business_name: data.business_name,
            category_id: data.category_id,
            price: data.price,
            description: data.description,
            whatsapp_url: data.whatsapp_url || "",
            instagram_url: data.instagram_url || "",
            maps_url: data.maps_url || "",
            image_url: data.image_url
        });
        setPreview(data.image_url); // Set preview pakai gambar lama dulu
      })
      .catch((err) => {
        alert("Gagal mengambil data produk");
        navigate("/admin/dashboard");
      });
  }, [id, navigate]);

  // Handle Input Teks
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Input Gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Submit (Simpan Perubahan)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gunakan FormData karena ada upload file
      const formData = new FormData();
      formData.append("product_name", form.product_name);
      formData.append("business_name", form.business_name);
      formData.append("category_id", form.category_id);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("whatsapp_url", form.whatsapp_url);
      formData.append("instagram_url", form.instagram_url);
      formData.append("maps_url", form.maps_url);

      // Hanya kirim gambar jika user memilih file baru
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Kirim ke Backend (PUT)
      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Produk berhasil diperbarui!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui produk. Cek koneksi atau data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <NavbarAdmin /> {/* Pastikan Navbar Admin Muncul */}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
            <button onClick={() => navigate("/admin/dashboard")} className="text-gray-500 hover:text-gray-800 flex items-center gap-2 text-sm font-bold">
                <FaArrowLeft /> Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KOLOM KIRI: Upload Gambar */}
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Foto Produk</label>
                
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition h-64">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <div className="text-center text-gray-400">
                            <FaImage className="text-4xl mx-auto mb-2" />
                            <p className="text-xs">Belum ada gambar</p>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        onChange={handleImageChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                <p className="text-xs text-gray-500 text-center">Klik gambar di atas untuk mengganti foto.</p>
            </div>

            {/* KOLOM KANAN: Input Data */}
            <div className="space-y-4">
                
                {/* Nama Produk */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Produk</label>
                    <input 
                        name="product_name" 
                        value={form.product_name} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        required 
                    />
                </div>

                {/* Nama Usaha */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Usaha / Penjual</label>
                    <input 
                        name="business_name" 
                        value={form.business_name} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        required 
                    />
                </div>

                {/* Kategori & Harga */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
                        <select 
                            name="category_id" 
                            value={form.category_id} 
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                        >
                            <option value="1">BUMDes</option>
                            <option value="2">UMKM</option>
                            <option value="3">Koperasi</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga (Rp)</label>
                        <input 
                            type="number" 
                            name="price" 
                            value={form.price} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            required 
                        />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi</label>
                    <textarea 
                        name="description" 
                        value={form.description} 
                        onChange={handleChange} 
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    ></textarea>
                </div>
            </div>

            {/* BARIS BAWAH: Link Sosmed & Maps (Full Width) */}
            <div className="md:col-span-2 space-y-4 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-800">Kontak & Lokasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                        name="whatsapp_url" 
                        value={form.whatsapp_url} 
                        onChange={handleChange} 
                        placeholder="Link WhatsApp (https://wa.me/...)" 
                        className="p-3 border rounded-lg text-sm"
                    />
                    <input 
                        name="instagram_url" 
                        value={form.instagram_url} 
                        onChange={handleChange} 
                        placeholder="Link Instagram" 
                        className="p-3 border rounded-lg text-sm"
                    />
                    <input 
                        name="maps_url" 
                        value={form.maps_url} 
                        onChange={handleChange} 
                        placeholder="Link Google Maps" 
                        className="p-3 border rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* TOMBOL SIMPAN */}
            <div className="md:col-span-2 mt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex justify-center items-center gap-2 text-lg"
                >
                    {loading ? "Menyimpan..." : <><FaSave /> Simpan Perubahan</>}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}