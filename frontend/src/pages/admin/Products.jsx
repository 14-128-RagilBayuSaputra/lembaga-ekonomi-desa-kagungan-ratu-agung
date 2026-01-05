import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    product_name: "",
    business_name: "",
    price: "",
  });

  const fetchProducts = () => {
    api.get("/admin/products")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus produk?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch {
      alert("Gagal menghapus produk");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/products", {
        ...form,
        price: form.price ? Number(form.price) : null,
      });

      setForm({
        product_name: "",
        business_name: "",
        price: "",
      });

      fetchProducts();
    } catch {
      alert("Gagal menambah produk");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Manajemen Produk
      </h1>

      {/* FORM TAMBAH */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <h2 className="font-semibold mb-3">Tambah Produk</h2>

        <input
          placeholder="Nama Produk"
          className="border p-2 w-full mb-2"
          value={form.product_name}
          onChange={(e) =>
            setForm({ ...form, product_name: e.target.value })
          }
          required
        />

        <input
          placeholder="Nama Usaha"
          className="border p-2 w-full mb-2"
          value={form.business_name}
          onChange={(e) =>
            setForm({ ...form, business_name: e.target.value })
          }
          required
        />

        <input
          placeholder="Harga (opsional)"
          className="border p-2 w-full mb-3"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Simpan
        </button>
      </form>

      {/* TABLE */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nama Produk</th>
            <th className="p-2 text-left">Usaha</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.product_name}</td>
              <td className="p-2">{item.business_name}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                Belum ada produk
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
