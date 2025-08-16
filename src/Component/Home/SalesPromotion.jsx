import React from 'react';
import { FaPercent, FaHeartbeat, FaCapsules, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Promotion content
const promoItems = [
  {
    icon: <FaPercent />,
    title: 'Up to 30% OFF',
    description: 'Save big on essential medicines and healthcare items.',
    extra: 'Discounts apply to selected categories and top brands.',
  },
  {
    icon: <FaHeartbeat />,
    title: 'Care for Your Health',
    description: 'Promoting wellness with affordable pricing & trusted brands.',
    extra: 'We prioritize your wellbeing with quality medications.',
  },
  {
    icon: <FaCapsules />,
    title: 'Top Medicines Included',
    description: 'Popular and effective medications now at special prices.',
    extra: 'From pain relief to chronic care — all in one place.',
  },
  {
    icon: <FaGift />,
    title: 'Limited-Time Offers',
    description: 'New discounts every week. Don’t miss out!',
    extra: 'Act fast! Exclusive online deals available now.',
  },
];

const SalesPromotion = () => {
  return (
    <section className="bg-green-50 py-16 px-4 sm:px-8 lg:px-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-700 mb-4">
          Save Big on Essentials!
        </h2>
        <p className="text-gray-700 text-base sm:text-lg max-w-2xl mx-auto">
          Take advantage of our ongoing promotions and get quality medicines at discounted prices.
        </p>
      </div>

      {/* Grid of Promo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12  ">
        {promoItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl text-center shadow hover:shadow-xl transition w-full"
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 text-green-700 text-3xl rounded-full mb-6">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-base text-gray-600 mb-2">{item.description}</p>
            <p className="text-sm text-gray-500">{item.extra}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SalesPromotion;
