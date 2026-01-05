import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Input from "../../components/ui/Input";

export default function ResetAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    reset_code: "",
    username: "",
    password: "",
  });
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
      await api.post("/auth/reset", form);
      alert("Admin berhasil direset. Silakan login.");
      navigate("/admin/login");
    } catch {
      setError("Kode reset salah atau data tidak valid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-white px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
        
        <h1 className="text-2xl font-bold text-center mb-2">
          Reset Admin
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Gunakan kode rahasia admin desa
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="reset_code"
            placeholder="Kode Rahasia"
            value={form.reset_code}
            onChange={handleChange}
          />

          <Input
            name="username"
            placeholder="Username Baru"
            value={form.username}
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password Baru"
            value={form.password}
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-green-600 text-white font-semibold
              hover:bg-green-700 transition
              disabled:opacity-60
            "
          >
            {loading ? "Memproses..." : "Reset Admin"}
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            onClick={() => navigate("/admin/login")}
            className="text-sm text-green-600 hover:underline"
          >
            ← Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
}
