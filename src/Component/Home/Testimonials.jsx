import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    feedback: "MediMarket is my go-to for medicines. Fast delivery and authentic products!",
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 2,
    name: 'James Lee',
    feedback: "Great discounts and excellent customer support. Highly recommend.",
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    feedback: "Wide variety of products and easy to navigate website.",
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

function Testimonials() {
  return (
    <section className="p-8 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
      <div className="max-w-4xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
        >
          {testimonials.map(({ id, name, feedback, avatar }) => (
            <SwiperSlide key={id}>
              <div className="flex items-center space-x-6 bg-gray-100 rounded-lg p-6 shadow transition-transform duration-500 ease-in-out hover:scale-105">
                <img
                  src={avatar}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-800 italic">"{feedback}"</p>
                  <p className="mt-2 font-semibold text-gray-900">{name}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Testimonials;
