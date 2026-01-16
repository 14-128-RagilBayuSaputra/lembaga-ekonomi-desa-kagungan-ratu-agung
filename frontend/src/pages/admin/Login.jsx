import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaArrowLeft, FaLeaf } from "react-icons/fa";
import api from "../../api/axios";

// IMPORT FOTO
import bgLogin from "../../assets/bg-login.jpg";

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
      
      {/* BACKGROUND (Tetap sama seperti yang Anda suka) */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-60"
        style={{ backgroundImage: `url(${bgLogin})` }}
      />
      <img 
        src={bgLogin}
        alt="Background Desa"
        className="absolute inset-0 w-full h-full object-contain z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* CARD LOGIN (DIPERBESAR KEMBALI) */}
      {/* max-w-md: Ukuran standar (lebih lebar dari sebelumnya) */}
      <div className="relative z-10 w-full max-w-md"> 
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30 animate-fade-in-up">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <FaUserShield className="text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
            <p className="text-sm text-green-600 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
               <FaLeaf /> Lembaga Ekonomi Desa
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm font-medium text-center">
                {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Username</label>
                <input
                    name="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-gray-800 text-base"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-gray-800 text-base"
                />
            </div>

            <button
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transform active:scale-95 transition-all duration-200 mt-2 text-base"
            >
                {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 flex flex-col items-center gap-3 border-t border-gray-200 pt-6">
            <button
                onClick={() => navigate("/admin/reset")}
                className="text-sm text-gray-500 hover:text-green-600 transition font-medium"
            >
                Lupa password?
            </button>
            
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-green-700 font-bold hover:underline transition"
            >
                <FaArrowLeft size={12} /> Kembali ke Beranda
            </button>
          </div>

        </div>
        <p className="text-center text-white/60 text-xs mt-6 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Sistem Informasi Desa
        </p>
      </div>
    </div>
  );
}