import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import api from "../../api/axios";

// IMPORT GAMBAR BACKGROUND
import bgLogin from "../../assets/bg-login.jpg";

// PERBAIKAN 1: Hapus import logo yang bikin error
// import logoTiyuh from "../../assets/logo.jpeg"; 

const StandardInput = ({ label, ...props }) => (
    <div>
        <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">{label}</label>
        <input 
            className="w-full px-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-gray-800 text-sm md:text-base"
            {...props} 
        />
    </div>
);

export default function ResetAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ reset_code: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/reset", form);
      setSuccess(true);
      // PERBAIKAN 2: Arahkan ke /login (sesuai AppRoutes)
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Kode reset salah atau data tidak valid");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 px-4">
      
      {/* BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-60"
        style={{ backgroundImage: `url(${bgLogin})` }}
      />
      <img src={bgLogin} alt="Background" className="absolute inset-0 w-full h-full object-contain z-0" />
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* CARD RESET */}
      <div className="relative z-10 w-full max-w-sm md:max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 animate-fade-in-up">
            
            {/* HEADER */}
            <div className="text-center mb-5">
                {/* PERBAIKAN 3: Panggil logo langsung sebagai string */}
                <img 
                    src="/logo.jpeg" 
                    alt="Logo Tiyuh" 
                    className="w-14 h-14 md:w-16 md:h-16 object-contain mx-auto mb-3"
                />
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Reset Admin</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Hanya untuk pengurus dengan kode rahasia.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-2.5 rounded-lg text-xs md:text-sm text-center mb-4 font-medium border border-red-100">
                    {error}
                </div>
            )}
            
            {success ? (
                <div className="bg-green-50 text-green-700 p-6 md:p-8 rounded-xl text-center flex flex-col items-center">
                    <FaCheckCircle className="text-4xl md:text-5xl mb-3 text-green-500" />
                    <h3 className="font-bold text-base md:text-lg">Berhasil Direset!</h3>
                    <p className="text-xs md:text-sm mt-1">Mengalihkan ke halaman login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                    <StandardInput
                        label="Kode Rahasia"
                        name="reset_code"
                        type="text"
                        placeholder="••••••••"
                        value={form.reset_code}
                        onChange={handleChange}
                        required
                    />

                    <div className="h-px bg-gray-100 my-1"></div>

                    <StandardInput
                        label="Username Baru"
                        name="username"
                        type="text"
                        placeholder="Username baru"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <StandardInput
                        label="Password Baru"
                        name="password"
                        type="password"
                        placeholder="Password baru"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        disabled={loading}
                        className="w-full py-3 md:py-3.5 rounded-xl bg-gray-800 text-white font-bold hover:bg-black hover:shadow-lg transition-all mt-2 text-sm md:text-base"
                    >
                        {loading ? "Memverifikasi..." : "Reset Akun"}
                    </button>
                </form>
            )}

            <div className="text-center mt-5 pt-3 border-t border-gray-200">
                {/* PERBAIKAN 4: Navigasi kembali ke /login */}
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 hover:text-gray-800 transition font-medium"
                >
                    <FaArrowLeft size={10} /> Batal, kembali ke login
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}