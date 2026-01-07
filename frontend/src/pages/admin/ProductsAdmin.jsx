import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProductsAdmin({ title, category }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_name: "",
    business_name: "",
    price: "",
    description: "",
  });

  const fetchProducts = () => {
    api.get("/admin/products")
      .then((res) => {
        const filtered = res.data.data.filter(
          (p) => p.category?.name === category
        );
        setProducts(filtered);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/products", {
        ...form,
        category,
        price: form.price ? Number(form.price) : null,
      });

      setForm({
        product_name: "",
        business_name: "",
        price: "",
        description: "",
      });

      fetchProducts();
    } catch {
      alert("Gagal menambah produk");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          placeholder="Nama Produk"
          className="border p-2 w-full"
          value={form.product_name}
          onChange={(e) =>
            setForm({ ...form, product_name: e.target.value })
          }
          required
        />

        <input
          placeholder="Nama Usaha"
          className="border p-2 w-full"
          value={form.business_name}
          onChange={(e) =>
            setForm({ ...form, business_name: e.target.value })
          }
          required
        />

        <input
          placeholder="Harga (opsional)"
          className="border p-2 w-full"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <textarea
          placeholder="Deskripsi Produk"
          className="border p-2 w-full"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Simpan
        </button>
      </form>

      {/* LIST */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Produk</th>
              <th className="p-2 text-left">Usaha</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.product_name}</td>
                <td className="p-2">{p.business_name}</td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="p-4 text-center text-gray-500"
                >
                  Belum ada produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
