import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';  // <-- import useNavigate
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
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

  const handleCardClick = (id) => {
    // Navigate to category details page using category as param
    navigate(`/category/${id}`);
  };

  if (products.length === 0) {
    return <p className="text-center text-gray-600">No discounted products found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Discounted Products</h2>
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
        {products.map((prod) => (
          <SwiperSlide key={prod._id}>
            <div
              onClick={() => handleCardClick(prod._id)}
              className="cursor-pointer bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <div className="h-48 w-full bg-gray-100 overflow-hidden rounded mb-4">
                <img
                  src={prod.imageURL}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain mx-auto"
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default DiscountedProductsSlider;
