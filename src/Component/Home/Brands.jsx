import React from 'react';

const featuredBrands = [
  {
    id: 1,
    name: 'PharmaCorp',
    logoURL: 'https://i.ibb.co/S8SC5qN/Pharma-Corp.jpg',
    description: 'Leading innovator in health and wellness products.',
  },
  {
    id: 2,
    name: 'MediLife',
    logoURL: 'https://i.ibb.co/xKBMS2c5/MediLife.jpg',
    description: 'Committed to quality medicines and care.',
  },
  {
    id: 3,
    name: 'HealthPlus',
    logoURL: 'https://i.ibb.co/4g0Nv4dW/Health-Plus.png',
    description: 'Trusted brand for affordable medications.',
  },
  {
    id: 4,
    name: 'CureWell',
    logoURL: 'https://i.ibb.co/F4N1Q8g9/CureWell.jpg',
    description: 'Innovative solutions for better health outcomes.',
  },
];

function Brands() {
  return (
    <section className="p-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Brands</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {featuredBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center 
              transition-transform duration-300 ease-in-out
              hover:shadow-xl hover:scale-105
              animate-fadeIn"
          >
            <img
              src={brand.logoURL}
              alt={brand.name}
              className="mx-auto mb-4 h-24 object-contain"
            />
            <h3 className="text-xl font-semibold mb-2">{brand.name}</h3>
            <p className="text-gray-600 text-sm">{brand.description}</p>
          </div>
        ))}
      </div>

      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
      `}</style>
    </section>
  );
}

export default Brands;
