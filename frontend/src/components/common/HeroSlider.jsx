import { useEffect, useState } from "react";
import { FaPlus, FaCloudUploadAlt, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function HeroSlider({ isAdmin, isHomePage, hideText = false }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  
  const ENDPOINT_PUBLIC = "/sliders";
  const ENDPOINT_ADMIN = "/admin/sliders"; 
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 

  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ADD"); 
  const [editId, setEditId] = useState(null);
  const [slideForm, setSlideForm] = useState({ title: "", description: "" });
  const [imageFiles, setImageFiles] = useState([]); 
  const [previews, setPreviews] = useState([]); 

  // --- FETCH DATA ---
  const fetchSliders = () => {
    const url = isAdmin ? ENDPOINT_ADMIN : ENDPOINT_PUBLIC;
    api.get(url)
      .then((res) => {
        const data = res.data.data || [];
        setSlides(data);
      })
      .catch((err) => console.error("Gagal fetch slider:", err));
  };

  useEffect(() => { fetchSliders(); }, [isAdmin]);

  // --- AUTO SLIDE ---
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => { setIndex((prev) => (prev + 1) % slides.length); }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  // --- HANDLERS (Sama seperti sebelumnya) ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const validPreviews = [];
    files.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) { toast.error(`File ${file.name} terlalu besar (> 5MB)`); return; }
        validFiles.push(file); validPreviews.push(URL.createObjectURL(file));
    });
    if (validFiles.length > 0) {
        if (mode === "EDIT") { setImageFiles([validFiles[0]]); setPreviews([validPreviews[0]]); } 
        else { setImageFiles((prev) => [...prev, ...validFiles]); setPreviews((prev) => [...prev, ...validPreviews]); }
    }
  };

  const removeImage = (idx) => { setPreviews(prev => prev.filter((_, i) => i !== idx)); setImageFiles(prev => prev.filter((_, i) => i !== idx)); };
  const resetForm = () => { setSlideForm({ title: "", description: "" }); setImageFiles([]); setPreviews([]); setEditId(null); setMode("ADD"); };
  const openAddModal = (e) => { e.stopPropagation(); resetForm(); setIsManagerOpen(true); };
  const openEditModal = (e, slide) => { e.stopPropagation(); resetForm(); setMode("EDIT"); setEditId(slide.id); setSlideForm({ title: slide.title || "", description: slide.description || "" }); setPreviews([slide.image_url]); setIsManagerOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (mode === "EDIT") {
            const formData = new FormData();
            formData.append("title", slideForm.title);
            formData.append("description", slideForm.description);
            if (imageFiles.length > 0) formData.append("image", imageFiles[0]);
            await api.put(`${ENDPOINT_ADMIN}/${editId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Slider diperbarui!");
        } else {
            if (imageFiles.length === 0) { setLoading(false); return toast.error("Pilih minimal 1 foto!"); }
            const uploadPromises = imageFiles.map((file) => {
                const formData = new FormData();
                formData.append("image", file); formData.append("title", slideForm.title); formData.append("description", slideForm.description); formData.append("is_active", true); 
                return api.post(ENDPOINT_ADMIN, formData, { headers: { "Content-Type": "multipart/form-data" } });
            });
            await Promise.all(uploadPromises);
            toast.success(`${imageFiles.length} Slider berhasil diupload!`);
        }
        resetForm(); setIsManagerOpen(false); fetchSliders(); 
    } catch (error) { toast.error("Gagal menyimpan."); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => { if(!confirm("Hapus slider ini?")) return; try { await api.delete(`${ENDPOINT_ADMIN}/${id}`); fetchSliders(); toast.success("Dihapus"); } catch(e){ toast.error("Gagal hapus"); } };
  const handleToggle = async (slide) => { try { await api.put(`${ENDPOINT_ADMIN}/${slide.id}`, { ...slide, is_active: !slide.is_active }); fetchSliders(); } catch(e){} };

  if (slides.length === 0 && !isAdmin) return null; 
  const currentSlide = slides[index];

  // Logic: Overlay muncul hanya jika BUKAN admin DAN hideText = false
  const showTextOverlay = !isAdmin && !hideText; 

  return (
    <section className="relative w-full overflow-hidden group h-[50vh] md:h-[80vh] bg-gray-900 border-b border-gray-800">
      
      {slides.length > 0 ? (
          <div className="w-full h-full relative">
              
              {/* LAYER 1: Background Blur */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-50 transition-all duration-1000"
                style={{ backgroundImage: `url(${currentSlide?.image_url})` }}
              ></div>
              
              {/* LAYER 2: Overlay Gelap Tipis (TINT) */}
              {/* PERBAIKAN: Hapus layer ini jika hideText = true */}
              {!hideText && (
                 <div className="absolute inset-0 bg-black/20 z-0"></div>
              )}

              {/* LAYER 3: Gambar Utama */}
              <img 
                src={currentSlide?.image_url} 
                alt="Slider" 
                className={`relative z-10 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${!currentSlide?.is_active && isAdmin ? 'grayscale opacity-70' : 'opacity-100'} drop-shadow-2xl`} 
              />
              
              {/* LAYER 4: TEKS DESKRIPSI & GRADASI BAWAH */}
              {/* Jika hideText = true, ini tidak akan muncul sama sekali */}
              {showTextOverlay && (
                  <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-16 text-white pointer-events-none bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                    <h2 className="text-2xl md:text-5xl font-bold mb-2 drop-shadow-lg leading-tight">{currentSlide?.title}</h2>
                    <p className="text-sm md:text-lg opacity-90 line-clamp-2 max-w-3xl">{currentSlide?.description}</p>
                  </div>
              )}

          </div>
      ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
              <p>Belum ada slider.</p>
          </div>
      )}

      {/* ADMIN CONTROLS */}
      {isAdmin && isHomePage && (
        <button onClick={openAddModal} className="absolute top-4 right-4 z-50 bg-white text-green-600 w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition active:scale-95 border-2 border-green-600">
            <FaPlus size={20} />
        </button>
      )}

      {/* MODAL MANAGER */}
      {isManagerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsManagerOpen(false)}>
            <div className="bg-white rounded-xl w-full max-w-xl h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-lg text-gray-800">{mode === "EDIT" ? "Edit Slider" : "Upload Slider"}</h3>
                    <button onClick={() => setIsManagerOpen(false)} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"><FaTimes/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-green-700 uppercase block mb-2">{mode === "ADD" ? "Pilih Foto" : "Ganti Foto"}</label>
                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                <div className="w-20 h-20 bg-white border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center relative shrink-0 hover:bg-green-50 transition cursor-pointer group">
                                    <div className="text-center"><FaCloudUploadAlt className="text-green-400 text-xl mx-auto"/><span className="text-[9px] text-green-600 font-bold block mt-1">+ Foto</span></div>
                                    <input type="file" accept="image/*" multiple={mode === "ADD"} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                {previews.map((src, idx) => (
                                    <div key={idx} className="w-20 h-20 rounded-lg border border-gray-200 relative shrink-0 overflow-hidden group bg-gray-100">
                                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                                        {mode === "ADD" && <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-lg"><FaTrash size={10}/></button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <input type="text" placeholder="Judul (Opsional)" value={slideForm.title} onChange={e=>setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <textarea rows="2" placeholder="Deskripsi..." value={slideForm.description} onChange={e=>setSlideForm({...slideForm, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"></textarea>
                        </div>
                        <button disabled={loading} className="bg-green-600 text-white w-full py-2.5 rounded-lg text-sm font-bold shadow">{loading ? "Menyimpan..." : "Simpan"}</button>
                    </form>
                    {mode === "ADD" && (
                        <div className="space-y-3">
                            {slides.map((slide) => (
                                <div key={slide.id} className="flex items-center gap-3 bg-white border p-2 rounded-xl shadow-sm">
                                    <img src={slide.image_url} alt="slide" className="w-16 h-12 object-cover rounded-lg bg-gray-200" />
                                    <div className="flex-1 min-w-0"><p className="font-bold text-xs truncate">{slide.title || "Tanpa Judul"}</p></div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleToggle(slide)} className="p-1.5 hover:bg-gray-100 rounded">{slide.is_active ? <FaToggleOn className="text-green-600"/> : <FaToggleOff className="text-gray-300"/>}</button>
                                        <button onClick={() => openEditModal(e, slide)} className="p-1.5 bg-yellow-50 text-yellow-600 rounded"><FaEdit size={12}/></button>
                                        <button onClick={() => handleDelete(slide.id)} className="p-1.5 bg-red-50 text-red-600 rounded"><FaTrash size={12}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </section>
  );
}