import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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

      // ✅ SIMPAN TOKEN DENGAN KEY YANG BENAR
      localStorage.setItem("admin_token", res.data.token);

      // ✅ PINDAH KE DASHBOARD
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-1">
          Admin Login
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Lembaga Ekonomi Desa
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <button
            onClick={() => navigate("/admin/reset")}
            className="text-sm text-green-600 hover:underline"
          >
            Lupa password?
          </button>

          <div>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:underline"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
