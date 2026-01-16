import { useEffect, useState } from "react";
import { FaStore, FaHandshake, FaBullhorn, FaArrowRight } from "react-icons/fa"; // Icons
import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";
import HeroSlider from "../../components/common/HeroSlider";
import ProductDetailModal from "../../components/ui/ProductDetailModal";
import ProductCard from "../../components/ui/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Mengambil 6-8 produk terbaru saja untuk beranda
  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data.data.slice(0, 8) || []))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Navbar />
      
      {/* 1. HERO SLIDER */}
      <HeroSlider isAdmin={false} />

      {/* 2. SAMBUTAN / TENTANG */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-desa-dark mb-6">Membangun Ekonomi Desa Digital</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Website ini adalah wadah resmi untuk mempromosikan potensi ekonomi Desa Kagungan Ratu Agung. 
                Kami mengintegrasikan <strong>BUMDes</strong>, <strong>UMKM</strong>, dan <strong>Koperasi</strong> dalam satu platform 
                digital untuk menjangkau pasar yang lebih luas.
            </p>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                {[
                    { icon: <FaStore/>, title: "BUMDes", desc: "Badan Usaha Milik Desa yang menopang pendapatan asli desa." },
                    { icon: <FaHandshake/>, title: "Koperasi", desc: "Koperasi Merah Putih untuk kesejahteraan anggota." },
                    { icon: <FaBullhorn/>, title: "UMKM", desc: "Usaha kreatif warga desa yang siap bersaing." }
                ].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-desa-light border border-green-100 hover:shadow-lg transition">
                        <div className="text-4xl text-desa-primary mb-4 flex justify-center">{item.icon}</div>
                        <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 3. PANDUAN (HOW TO) */}
      <section className="py-16 bg-desa-primary text-white relative overflow-hidden">
          {/* Background pattern decorative */}
          <div className="absolute top-0 right-0 p-20 bg-white opacity-5 rounded-full translate-x-1/2 -translate-y-1/2"></div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Ingin Produk Anda Tampil Disini?</h2>
                <p className="text-green-100">Ikuti langkah mudah berikut untuk mendaftarkan usaha Anda.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { step: "01", title: "Siapkan Data", text: "Siapkan foto produk terbaik dan deskripsi usaha Anda." },
                    { step: "02", title: "Hubungi Admin", text: "Kontak admin desa melalui WhatsApp atau datang ke kantor." },
                    { step: "03", title: "Verifikasi", text: "Data akan divalidasi oleh tim Lembaga Ekonomi Desa." },
                    { step: "04", title: "Terbit!", text: "Produk Anda tayang dan bisa dilihat masyarakat luas." },
                ].map((item) => (
                    <div key={item.step} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition">
                        <div className="text-4xl font-black text-white/30 mb-2">{item.step}</div>
                        <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                        <p className="text-sm text-green-50">{item.text}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* 4. PRODUK TERBARU */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Jelajahi Produk Desa</h2>
                <p className="text-gray-500 mt-1">Pilihan produk terbaik dari warga desa</p>
            </div>
            {/* Tombol Lihat Semua (bisa diarahkan ke page lain jika mau) */}
            <button className="text-desa-primary font-bold flex items-center gap-2 hover:underline">
                Lihat Semua <FaArrowRight/>
            </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onClick={() => setSelectedProduct(item)}
              isAdmin={false} // Mode User
            />
          ))}
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="bg-desa-dark text-white py-8 text-center">
          <p>&copy; {new Date().getFullYear()} Lembaga Ekonomi Desa Kagungan Ratu Agung.</p>
      </footer>

      {/* MODAL DETAIL */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}