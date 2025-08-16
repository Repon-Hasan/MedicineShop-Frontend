import React from 'react';
import { motion } from 'framer-motion';

// Brand data
const featuredBrands = [
  {
    id: 1,
    name: 'PharmaCorp',
    logoURL: 'https://i.ibb.co/S8SC5qN/Pharma-Corp.jpg',
    description: 'PharmaCorp is a global leader in healthcare innovation, delivering trusted pharmaceutical solutions for every household.',
  },
  {
    id: 2,
    name: 'MediLife',
    logoURL: 'https://i.ibb.co/xKBMS2c5/MediLife.jpg',
    description: 'MediLife is known for its high-quality medicines, affordable pricing, and community-focused care.',
  },
  {
    id: 3,
    name: 'HealthPlus',
    logoURL: 'https://i.ibb.co/4g0Nv4dW/Health-Plus.png',
    description: 'HealthPlus offers reliable and effective medications, helping families stay healthy and worry-free.',
  },
  {
    id: 4,
    name: 'CureWell',
    logoURL: 'https://i.ibb.co/F4N1Q8g9/CureWell.jpg',
    description: 'CureWell combines innovation with science to deliver world-class wellness and pharmaceutical products.',
  },
];

const Brands = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
          Our Trusted Brands
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
          We collaborate with industry-leading brands to bring you safe, reliable, and effective health solutions. These names stand for trust, care, and innovation.
        </p>
      </div>

      {/* Brand Cards Grid */}
      <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {featuredBrands.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-all duration-300 text-center max-w-sm w-full mx-auto"
          >
            <div className="mb-5">
              <img
                src={brand.logoURL}
                alt={brand.name}
                className="h-28 mx-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {brand.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {brand.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
