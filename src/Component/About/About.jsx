import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MM from "../../assets/HH.jpeg"

function About() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <section id="about" className="bg-white py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-700 mb-4 mt-4" data-aos="fade-down">
            About MediMarket
          </h2>
          <p className="text-gray-600 text-lg" data-aos="fade-up">
            Your trusted partner in online healthcare. Reliable. Affordable. Fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
          {/* Left Content */}
          <div data-aos="fade-right">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Who We Are
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              At <strong>MediMarket</strong>, we are committed to delivering authentic, affordable medicines and healthcare essentials to your doorstep.
              With a strong focus on safety, customer satisfaction, and timely delivery, we’ve served thousands of happy customers across the country.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>✅ 100% Genuine Products</li>
              <li>✅ Licensed Pharmacy & Certified Pharmacists</li>
              <li>✅ Free Consultation Support</li>
              <li>✅ Fast & Safe Delivery Nationwide</li>
              <li>✅ Affordable Prices & Regular Discounts</li>
            </ul>
          </div>

          {/* Right Image */}
          <div data-aos="fade-left">
            <img
              src={MM}
              alt="Medicine and healthcare"
              className="rounded-lg shadow-lg w-96"
            />
          </div>
        </div>

        {/* Stats or Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-center mt-16 gap-8">
          <div data-aos="zoom-in">
            <h4 className="text-3xl text-green-700 font-bold">10K+</h4>
            <p className="text-gray-600 mt-1">Satisfied Customers</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="100">
            <h4 className="text-3xl text-green-700 font-bold">1M+</h4>
            <p className="text-gray-600 mt-1">Medicines Delivered</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="200">
            <h4 className="text-3xl text-green-700 font-bold">24/7</h4>
            <p className="text-gray-600 mt-1">Support Availability</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="300">
            <h4 className="text-3xl text-green-700 font-bold">500+</h4>
            <p className="text-gray-600 mt-1">Verified Suppliers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
