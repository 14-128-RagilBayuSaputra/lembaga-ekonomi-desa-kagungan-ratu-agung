import { useState, useMemo, useEffect } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaStore,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  /* ================= IMAGES ================= */
  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map((img) => img.image_url);
    }
    if (product.image_url) {
      return [product.image_url];
    }
    return [];
  }, [product]);

  const [index, setIndex] = useState(0);

  // reset index setiap buka produk baru
  useEffect(() => {
    setIndex(0);
  }, [product?.id]);

  const prevImage = () => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImage = () => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  /* ================= MAP ================= */
  const embedMap = useMemo(() => {
    if (!product.maps_url) return null;

    // Case 1: URL mengandung @lat,lng
    const match = product.maps_url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      const lat = match[1];
      const lng = match[2];
      return `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    }

    // Case 2: Koordinat manual "lat,lng"
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(product.maps_url)) {
      return `https://www.google.com/maps?q=${product.maps_url}&z=17&output=embed`;
    }

    // Case 3: alamat / nama tempat
    return `https://www.google.com/maps?q=${encodeURIComponent(
      product.maps_url
    )}&z=17&output=embed`;
  }, [product.maps_url]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden relative animate-fadeIn">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-black z-10"
        >
          ×
        </button>

        {/* ================= IMAGE SLIDER ================= */}
        {images.length > 0 && (
          <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
            <img
              src={images[index]}
              alt={product.product_name}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold">{product.product_name}</h2>

          <p className="text-gray-500 text-sm">{product.business_name}</p>

          {product.price && (
            <p className="font-semibold text-green-600">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          )}

          {product.description && (
            <p className="text-gray-700 text-sm">{product.description}</p>
          )}

          {/* ================= SOCIAL ================= */}
          <div className="flex gap-4 pt-2 text-2xl">
            {product.whatsapp_url && (
              <a href={product.whatsapp_url} target="_blank" rel="noreferrer">
                <FaWhatsapp className="text-green-600 hover:scale-110 transition" />
              </a>
            )}
            {product.instagram_url && (
              <a href={product.instagram_url} target="_blank" rel="noreferrer">
                <FaInstagram className="text-pink-600 hover:scale-110 transition" />
              </a>
            )}
            {product.facebook_url && (
              <a href={product.facebook_url} target="_blank" rel="noreferrer">
                <FaFacebook className="text-blue-600 hover:scale-110 transition" />
              </a>
            )}
            {product.shopee_url && (
              <a href={product.shopee_url} target="_blank" rel="noreferrer">
                <FaStore className="text-orange-500 hover:scale-110 transition" />
              </a>
            )}
          </div>

          {/* ================= MAP ================= */}
          {embedMap && (
            <div className="mt-4">
              <iframe
                src={embedMap}
                className="w-full h-48 rounded"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={product.maps_url}
                target="_blank"
                rel="noreferrer"
                className="block mt-2 text-center text-sm text-green-700 hover:underline"
              >
                Buka di Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
