import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import axiosSecure from "../../utils/axiosSecure";

const SliderSection = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://backend-nu-livid-37.vercel.app/banners")
      .then((res) => {
        setBanners(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch banners:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (loading)
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "70vh" }}
      >
        <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (banners.length === 0)
    return (
      <p
        className="text-center py-10 text-gray-500"
        style={{ height: "70vh" }}
      >
        No banners available
      </p>
    );

  return (
    <section
      className="relative w-full px-6 mt-6 overflow-hidden rounded-lg shadow-lg"
      style={{ height: "70vh" }}
    >
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={banner.imageURL}
            alt={banner.title || `Banner ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/800x450?text=Image+Not+Found";
            }}
          />
          <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-white text-center p-4 rounded-lg">
            <h2 className="text-3xl md:text-5xl text-gray-500 font-bold">{banner.title}</h2>
            <p className="mt-2 text-lg md:text-xl text-black">{banner.description}</p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrent(current === 0 ? banners.length - 1 : current - 1)
        }
        className="absolute top-1/2 left-6 transform -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 rounded-full text-white z-20"
        aria-label="Previous Slide"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={() => setCurrent((current + 1) % banners.length)}
        className="absolute top-1/2 right-6 transform -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 rounded-full text-white z-20"
        aria-label="Next Slide"
      >
        <FaArrowRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-4 h-4 rounded-full transition-colors ${
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
