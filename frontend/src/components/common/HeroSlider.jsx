import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api
      .get("/sliders")
      .then((res) => {
        setSlides(res.data.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="h-[35vh] md:h-[65vh] bg-gray-200 flex items-center justify-center">
        Slider Desa
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden
      h-[40vh]
      sm:h-[50vh]
      md:h-[60vh]
      lg:h-[70vh]
      max-h-[650px]
    ">
      {/* IMAGE */}
      <img
        src={slides[index].image_url}
        alt="Hero Slider"
        className="
          absolute inset-0
          w-full h-full
          object-cover object-center
          transition-opacity duration-700
        "
      />

      {/* OVERLAY (optional, tapi bagus) */}
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
}
