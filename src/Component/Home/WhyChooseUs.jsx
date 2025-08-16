import React, { useEffect } from 'react';
import { FaShippingFast, FaShieldAlt, FaMedkit, FaStar } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const WhyChooseUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-4 leading-snug">
          Why Choose <span className="text-gray-800">MedicinesHope</span>?
        </h2>
        <p className="text-gray-500 text-base sm:text-lg">
          We are committed to making healthcare accessible, reliable, and convenient for everyone. Here's why our customers trust us.
        </p>
      </div>

      {/* Grid of Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Feature Card 1 */}
        <div
          data-aos="fade-up"
          className="bg-green-50 border border-green-100 rounded-xl p-8 text-center shadow hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full mb-5 text-3xl">
            <FaShippingFast />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Safe Delivery</h3>
          <p className="text-sm text-gray-600">
            We partner with top logistics to ensure your medicines arrive safely, securely, and faster than ever—nationwide.
          </p>
        </div>

        {/* Feature Card 2 */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="bg-green-50 border border-green-100 rounded-xl p-8 text-center shadow hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full mb-5 text-3xl">
            <FaShieldAlt />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">100% Genuine Medicines</h3>
          <p className="text-sm text-gray-600">
            All products are sourced directly from verified pharmaceutical companies and come with complete authenticity seals.
          </p>
        </div>

        {/* Feature Card 3 */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="bg-green-50 border border-green-100 rounded-xl p-8 text-center shadow hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full mb-5 text-3xl">
            <FaMedkit />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Affordable Healthcare</h3>
          <p className="text-sm text-gray-600">
            We offer competitive prices, regular discounts, and wallet-friendly alternatives—because health shouldn’t cost a fortune.
          </p>
        </div>

        {/* Feature Card 4 */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="bg-green-50 border border-green-100 rounded-xl p-8 text-center shadow hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full mb-5 text-3xl">
            <FaStar />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">5,000+ Happy Customers</h3>
          <p className="text-sm text-gray-600">
            Our satisfaction rating speaks for itself. We’re proud to be the trusted choice for families and clinics across the country.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
