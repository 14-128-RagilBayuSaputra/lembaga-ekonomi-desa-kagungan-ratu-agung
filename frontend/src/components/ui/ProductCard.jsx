export default function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">
          {product.product_name}
        </h3>

        <p className="text-sm text-gray-500">
          {product.business_name}
        </p>

        {product.price && (
          <p className="mt-2 font-bold text-green-600">
            Rp {product.price.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
