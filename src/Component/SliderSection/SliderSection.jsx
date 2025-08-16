import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import BgBanner from "../../assets/BgBanner.jpeg";

const SliderSection = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch banners
  useEffect(() => {
    axios
      .get("https://backend-nu-livid-37.vercel.app/banners")
      .then((res) => {
        setBanners(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch banners:", error);
        setLoading(false);
      });
  }, []);

  // Auto-slide every 5s
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-24" style={{ height: "70vh" }}>
        <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <p className="text-center pt-24 text-gray-500" style={{ height: "70vh" }}>
        No banners available
      </p>
    );
  }

  return (
    <section className="relative w-full bg-black overflow-hidden" style={{ height: "80vh" }}>
      {/* Slider Container */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Blurred Background */}
            <img
              src={BgBanner}
              alt=""
              className="w-full h-full object-cover scale-110 absolute inset-0 z-0"
              aria-hidden="true"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/1280x720?text=Image+Not+Found";
              }}
            />

            {/* Foreground Banner Image */}
            <img
              src={banner.imageURL}
              alt={banner.title || `Banner ${index + 1}`}
              className="w-full h-full object-contain relative z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/1280x720?text=Image+Not+Found";
              }}
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 z-20 bg-black/50 flex flex-col justify-center items-center text-center px-4 md:px-16 py-6 md:py-12">
              <div className="animate-fade-in-up delay-200">
                <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-4xl drop-shadow-lg">
                  <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {banner.title || "Welcome to MediMarket"}
                  </span>
                </h2>
              </div>

              {banner.description && (
                <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-amber-400 max-w-3xl font-medium animate-fade-in-up delay-500">
                  {banner.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Arrows (hidden on small devices) */}
      <button
        onClick={() => setCurrent(current === 0 ? banners.length - 1 : current - 1)}
        className="hidden md:flex absolute top-1/2 left-4 md:left-10 transform -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 rounded-full text-white z-30"
        aria-label="Previous Slide"
      >
        <FaArrowLeft />
      </button>

      <button
        onClick={() => setCurrent((current + 1) % banners.length)}
        className="hidden md:flex absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 rounded-full text-white z-30"
        aria-label="Next Slide"
      >
        <FaArrowRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3 z-30">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-300 ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default SliderSection;
