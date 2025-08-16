import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaStar } from 'react-icons/fa';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    feedback: 'MediMarket is my go-to for medicines. Fast delivery and authentic products!',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Lee',
    location: 'Toronto, Canada',
    feedback: 'Great discounts and excellent customer support. Highly recommend.',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    rating: 4,
  },
  {
    id: 3,
    name: 'Aisha Patel',
    location: 'London, UK',
    feedback: 'Wide variety of products and easy to navigate website.',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 5,
  },
  {
    id: 4,
    name: 'Carlos Mendoza',
    location: 'Madrid, Spain',
    feedback: 'Very satisfied with the service and the prices are unbeatable.',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    rating: 4,
  },
  {
    id: 5,
    name: 'Emily Chen',
    location: 'Singapore',
    feedback: 'Always reliable and the delivery is super fast!',
    avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
    rating: 5,
  },
];


const Testimonials = () => {
  return (
    <section className="bg-green-50 py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Real feedback from real customers who trust Medishop for their health needs.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
        >
          {testimonials.map(({ id, name, location, feedback, avatar, rating }) => (
            <SwiperSlide key={id}>
              <div className="bg-white rounded-xl shadow-md p-8 text-left flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-200"
                />
                <div className="flex-1">
                  <p className="text-gray-700 italic text-base mb-3">"{feedback}"</p>
                  <div className="text-green-600 flex items-center gap-1 mb-2">
                    {Array(rating)
                      .fill()
                      .map((_, i) => (
                        <FaStar key={i} />
                      ))}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{name}</h4>
                  <span className="text-sm text-gray-500">{location}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
