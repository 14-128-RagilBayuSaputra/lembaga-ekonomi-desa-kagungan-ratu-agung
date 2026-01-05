import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get("/sliders")
      .then((res) => {
        setSlides(res.data.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center">
        Slider Desa
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-96 overflow-hidden">
      <img
        src={slides[index].image_url}
        alt="Slider"
        className="w-full h-full object-cover transition-all duration-700"
      />
    </div>
  );
}
