import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import axiosSecure from '../../utils/axiosSecure';

function DiscountedProductsSlider() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounted = async () => {
      try {
        const res = await axios.get('https://backend-nu-livid-37.vercel.app/discountedMedicines');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching discounted products:', err);
      }
    };

    fetchDiscounted();
  }, []);

  const handleCardClick = (category) => {
    navigate(`/discountCategory/${category}`);
  };

  if (products.length === 0) {
    return <p className="text-center text-gray-600">No discounted products found.</p>;
  }

  return (
    <div className="p-6" id='discounted'>
      <h2 className="text-3xl font-bold mb-4 text-center text-green-600">Discounted Products</h2>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {products.map((prod, index) => (
          <SwiperSlide key={prod._id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleCardClick(prod.category)}
              className="cursor-pointer bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <div className="h-48 w-full bg-gray-100 overflow-hidden rounded mb-4">
                <img
                  src={prod.imageURL}
                  alt={prod.name}
                  className=" object-cover w-full h-full "
                />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-center">{prod.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{prod.generic}</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold text-green-700">
                  ${(prod.price * (1 - prod.discount / 100)).toFixed(2)}
                </span>
                <span className="text-sm line-through text-gray-400">
                  ${prod.price.toFixed(2)}
                </span>
              </div>
              <span className="mt-2 inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                {prod.discount}% off
              </span>

              {/* Button */}
              <button
                onClick={() => handleCardClick(prod.category)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
              >
                See More
              </button>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default DiscountedProductsSlider;
