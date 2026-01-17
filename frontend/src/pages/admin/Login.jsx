import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLeaf } from "react-icons/fa";
import api from "../../api/axios";

// IMPORT GAMBAR
import bgLogin from "../../assets/bg-login.jpg";
import logoTiyuh from "../../assets/logo.jpeg"; 

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("admin_token", res.data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 px-4">
      
      {/* BACKGROUND (TIDAK DIUBAH SAMA SEKALI) */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-60"
        style={{ backgroundImage: `url(${bgLogin})` }}
      />
      <img src={bgLogin} alt="Background" className="absolute inset-0 w-full h-full object-contain z-0" />
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* CARD LOGIN (YANG DIUBAH HANYA BAGIAN INI KE BAWAH) */}
      {/* max-w-sm: Agar di tablet/HP tidak terlalu lebar. md:max-w-md: Normal di laptop */}
      <div className="relative z-10 w-full max-w-sm md:max-w-md"> 
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/30 animate-fade-in-up">
          
          {/* HEADER */}
          <div className="text-center mb-6">
            <img 
                src={logoTiyuh} 
                alt="Logo Tiyuh" 
                // Ukuran logo disesuaikan (w-16 di tablet, w-20 di laptop)
                className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto mb-3 md:mb-4 hover:scale-105 transition duration-300"
            />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
            <p className="text-xs md:text-sm text-green-600 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
               <FaLeaf /> Lembaga Ekonomi Tiyuh
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 rounded mb-5 text-xs md:text-sm font-medium text-center">
                {error}
            </div>
          )}

          {/* FORM INPUT */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Username</label>
                <input
                    name="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    // py-2.5 agar tidak terlalu tinggi di tablet
                    className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-gray-800 text-sm md:text-base"
                />
            </div>

            <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-gray-800 text-sm md:text-base"
                />
            </div>

            <button
                disabled={loading}
                className="w-full py-3 md:py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transform active:scale-95 transition-all duration-200 mt-2 text-sm md:text-base"
            >
                {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 flex flex-col items-center gap-2 border-t border-gray-200 pt-4">
            <button
                onClick={() => navigate("/admin/reset")}
                className="text-xs md:text-sm text-gray-500 hover:text-green-600 transition font-medium"
            >
                Lupa password?
            </button>
            
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-xs md:text-sm text-green-700 font-bold hover:underline transition"
            >
                <FaArrowLeft size={12} /> Kembali ke Beranda
            </button>
          </div>

        </div>
        <p className="text-center text-white/60 text-[10px] md:text-xs mt-6 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Sistem Informasi Desa
        </p>
      </div>
    </div>
  );
}