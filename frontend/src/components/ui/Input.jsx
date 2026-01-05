export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="
        w-full px-4 py-3 rounded-xl
        border border-gray-200
        bg-white/80 backdrop-blur
        focus:outline-none focus:ring-2 focus:ring-green-500
        transition
      "
    />
  );
}
