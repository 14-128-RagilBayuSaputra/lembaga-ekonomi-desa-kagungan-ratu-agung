import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get("/sliders").then(res => {
      setSlides(res.data.data.filter(s => s.is_active));
    });
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <section className="relative h-[60vh]">
      <img
        src={slides[index].image_url}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
}
