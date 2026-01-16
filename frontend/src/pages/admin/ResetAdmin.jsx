import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKey, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import api from "../../api/axios";

import bgLogin from "../../assets/bg-login.jpg";

// Input Component (Ukuran Standar)
const StandardInput = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">{label}</label>
        <input 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-gray-800 text-base"
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
      setTimeout(() => navigate("/admin/login"), 2000);
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
      <img
        src={bgLogin}
        alt="Background Desa"
        className="absolute inset-0 w-full h-full object-contain z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* CARD RESET (DIPERBESAR: max-w-md) */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in-up">
            
            {/* HEADER */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-amber-100">
                    <FaKey className="text-2xl" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Reset Admin</h1>
                <p className="text-sm text-gray-500 mt-1">Hanya untuk pengurus dengan kode rahasia.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-5 font-medium border border-red-100">
                    {error}
                </div>
            )}
            
            {success ? (
                <div className="bg-green-50 text-green-700 p-8 rounded-xl text-center flex flex-col items-center">
                    <FaCheckCircle className="text-5xl mb-3 text-green-500" />
                    <h3 className="font-bold text-lg">Berhasil Direset!</h3>
                    <p className="text-sm mt-1">Mengalihkan ke halaman login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <StandardInput
                        label="Kode Rahasia"
                        name="reset_code"
                        type="text"
                        placeholder="••••••••"
                        value={form.reset_code}
                        onChange={handleChange}
                        required
                    />

                    <div className="h-px bg-gray-100 my-2"></div>

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
                        className="w-full py-3.5 rounded-xl bg-gray-800 text-white font-bold hover:bg-black hover:shadow-lg transition-all mt-4 text-base"
                    >
                        {loading ? "Memverifikasi..." : "Reset Akun"}
                    </button>
                </form>
            )}

            <div className="text-center mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={() => navigate("/admin/login")}
                    className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition font-medium"
                >
                    <FaArrowLeft size={12} /> Batal, kembali ke login
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}