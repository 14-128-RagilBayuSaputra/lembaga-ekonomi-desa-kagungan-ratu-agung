import { FaWhatsapp, FaInstagram, FaFacebook, FaStore } from "react-icons/fa";

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden relative animate-fadeIn">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-black"
        >
          ×
        </button>

        {/* IMAGE */}
        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-full h-56 object-cover"
        />

        {/* CONTENT */}
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold">
            {product.product_name}
          </h2>

          <p className="text-gray-500 text-sm">
            {product.business_name}
          </p>

          {product.price && (
            <p className="font-semibold text-green-600">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          )}

          {product.description && (
            <p className="text-gray-700 text-sm">
              {product.description}
            </p>
          )}

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 pt-3 text-2xl">
            {product.whatsapp_url && (
              <a
                href={product.whatsapp_url}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 hover:scale-110 transition"
              >
                <FaWhatsapp />
              </a>
            )}

            {product.instagram_url && (
              <a
                href={product.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="text-pink-600 hover:scale-110 transition"
              >
                <FaInstagram />
              </a>
            )}

            {product.facebook_url && (
              <a
                href={product.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:scale-110 transition"
              >
                <FaFacebook />
              </a>
            )}

            {product.shopee_url && (
              <a
                href={product.shopee_url}
                target="_blank"
                rel="noreferrer"
                className="text-orange-500 hover:scale-110 transition"
              >
                <FaStore />
              </a>
            )}
          </div>

          {/* MAP */}
          {product.maps_url && (
            <a
              href={product.maps_url}
              target="_blank"
              rel="noreferrer"
              className="block mt-4 text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Lihat Lokasi Usaha
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
