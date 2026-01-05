export default function CategoryHero({ title, description, image }) {
  return (
    <section className="relative h-[240px] md:h-[360px] w-full overflow-hidden">
      {/* Background image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            {title}
          </h1>
          <p className="max-w-xl text-sm md:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
