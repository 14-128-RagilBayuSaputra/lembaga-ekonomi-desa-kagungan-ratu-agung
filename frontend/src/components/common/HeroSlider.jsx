import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaCamera, FaEdit, FaToggleOn, FaToggleOff, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import api from "../../api/axios";
import toast from "react-hot-toast";

// === PENTING: Pastikan parameter props diterima dengan benar ===
export default function HeroSlider({ isAdmin, isHomePage }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false); // State loading upload

  // State Form
  const [sliderForm, setSliderForm] = useState({ title: "", description: "", image_url: "", is_active: true });
  const [imageFile, setImageFile] = useState(null); // Menyimpan file mentah
  const [previewUrl, setPreviewUrl] = useState(""); // Preview gambar

  const fetchSliders = () => {
    const endpoint = isAdmin ? "/sliders?all=true" : "/sliders"; 
    api.get(endpoint)
      .then((res) => {
        const data = res.data.data || [];
        // Jika User: tampilkan yg aktif saja. Jika Admin: Tampilkan semua.
        setSlides(isAdmin ? data : data.filter(s => s.is_active));
      })
      .catch(console.error);
  };

  useEffect(() => { fetchSliders(); }, [isAdmin]);

  // Auto slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => { setIndex((prev) => (prev + 1) % slides.length); }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  // --- HANDLER MODAL ---
  const handleAddClick = (e) => {
    e.stopPropagation();
    setEditData(null);
    setSliderForm({ title: "", description: "", image_url: "", is_active: true });
    setPreviewUrl("");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (e, slide) => {
    e.stopPropagation();
    setEditData(slide);
    setSliderForm({ 
        title: slide.title || "", description: slide.description || "", 
        image_url: slide.image_url, is_active: slide.is_active 
    });
    setPreviewUrl(slide.image_url); // Tampilkan gambar lama
    setImageFile(null);
    setIsModalOpen(true);
  };

  // --- HANDLER UPLOAD & SUBMIT ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Preview lokal
    }
  };

  const handleSliderSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpload(true);

    try {
        let finalImageUrl = sliderForm.image_url;

        // 1. JIKA ADA FILE BARU DIPILIH -> UPLOAD DULU
        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile); // Pastikan backend terima field "image"

            // Upload ke endpoint upload backend Anda
            const uploadRes = await api.post("/admin/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            // Ambil URL dari respon backend (sesuaikan dengan struktur respon backend Anda)
            // Biasanya: res.data.url atau res.data.data.url
            finalImageUrl = uploadRes.data.url || uploadRes.data.data?.url; 
        }

        // 2. SIMPAN DATA SLIDER KE DATABASE
        const payload = { ...sliderForm, image_url: finalImageUrl };

        if (editData) {
            await api.put(`/sliders/${editData.id}`, payload);
            toast.success("Slider diperbarui!");
        } else {
            await api.post("/sliders", payload);
            toast.success("Slider ditambahkan!");
        }

        setIsModalOpen(false);
        fetchSliders();
    } catch (error) {
        console.error(error);
        toast.error("Gagal menyimpan. Cek koneksi atau ukuran gambar.");
    } finally {
        setLoadingUpload(false);
    }
  };

  // Handler Hapus & Toggle Status (Sama seperti sebelumnya)
  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();
    if(!confirm("Hapus slider ini?")) return;
    try { await api.delete(`/sliders/${id}`); toast.success("Terhapus"); fetchSliders(); setIndex(0); } catch(e){ toast.error("Gagal"); }
  };
  
  const handleToggleStatus = async (e, slide) => {
    e.stopPropagation();
    try { await api.put(`/sliders/${slide.id}`, { ...slide, is_active: !slide.is_active }); fetchSliders(); } catch(e){}
  }

  // --- RENDER UTAMA ---
  if (slides.length === 0) {
    return (
      <div className="h-[50vh] bg-gray-100 flex flex-col items-center justify-center border-b text-gray-400 relative">
        <FaCamera className="text-5xl mb-4 opacity-50" />
        <p>Belum ada gambar slider.</p>
        {isAdmin && isHomePage && (
            <button onClick={handleAddClick} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition flex items-center gap-2 relative z-10">
                <FaPlus /> Tambah Slide Pertama
            </button>
        )}
        {renderSliderModal()}
      </div>
    );
  }

  const currentSlide = slides[index];

  return (
    <section className="relative w-full overflow-hidden group h-[50vh] md:h-[70vh] max-h-[700px] bg-gray-900">
      {/* IMAGE DISPLAY */}
      <div className={`w-full h-full relative transition-opacity duration-500 ${!currentSlide.is_active && isAdmin ? 'opacity-50 grayscale' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />
          <img src={currentSlide.image_url} alt="Hero Slider" className="w-full h-full object-cover" />
          
          <div className="absolute bottom-0 left-0 w-full z-20 p-8 md:p-16 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{currentSlide.title}</h2>
            <p className="text-lg opacity-90">{currentSlide.description}</p>
          </div>
      </div>

      {/* ADMIN CONTROLS (HANYA MUNCUL DI ADMIN HOME) */}
      {isAdmin && isHomePage && (
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-3 items-end">
            <button onClick={handleAddClick} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition">
                <FaPlus size={20}/>
            </button>
            
            <div className="bg-white/10 backdrop-blur p-2 rounded-xl border border-white/20 flex flex-col gap-2 mt-2 w-40">
                <button onClick={(e) => handleEditClick(e, currentSlide)} className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded text-sm font-bold flex items-center justify-center gap-2">
                    <FaEdit /> Ganti Foto
                </button>
                <button onClick={(e) => handleToggleStatus(e, currentSlide)} className={`p-2 rounded text-sm font-bold flex items-center justify-center gap-2 text-white ${currentSlide.is_active ? 'bg-green-800' : 'bg-gray-500'}`}>
                     {currentSlide.is_active ? 'Aktif' : 'Non-Aktif'}
                </button>
                <button onClick={(e) => handleDeleteClick(e, currentSlide.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded text-sm font-bold flex items-center justify-center gap-2">
                    <FaTrash /> Hapus
                </button>
            </div>
        </div>
      )}

      {renderSliderModal()}
    </section>
  );

  function renderSliderModal() {
    if (!isModalOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                    <h3 className="font-bold text-lg">{editData ? "Ganti Slider" : "Tambah Slider Baru"}</h3>
                    <button onClick={() => setIsModalOpen(false)}><FaTimes /></button>
                </div>
                
                <form onSubmit={handleSliderSubmit} className="p-6 space-y-4">
                     {/* INPUT FILE GAMBAR */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Foto (Wajib)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="h-40 mx-auto object-cover rounded shadow-md" />
                            ) : (
                                <div className="text-gray-400 py-4">
                                    <FaCloudUploadAlt className="text-4xl mx-auto mb-2"/>
                                    <p className="text-sm">Klik untuk upload gambar</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required={!editData} />
                        </div>
                    </div>

                    {/* INPUT TEXT (OPSIONAL - Boleh dikosongkan jika user malas isi) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul (Opsional)</label>
                        <input type="text" value={sliderForm.title} onChange={e => setSliderForm({...sliderForm, title: e.target.value})} className="w-full border p-2 rounded" placeholder="Judul slide..." />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
                        <textarea rows="2" value={sliderForm.description} onChange={e => setSliderForm({...sliderForm, description: e.target.value})} className="w-full border p-2 rounded" placeholder="Keterangan singkat..."></textarea>
                    </div>

                    <button type="submit" disabled={loadingUpload} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-400">
                        {loadingUpload ? "Sedang Mengupload..." : "Simpan Slider"}
                    </button>
                </form>
            </div>
        </div>
    );
  }
}