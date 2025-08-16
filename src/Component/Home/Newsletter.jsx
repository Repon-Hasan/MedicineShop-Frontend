import React, { useState } from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Subscribed!',
      text: 'Thank you for subscribing to our newsletter.',
      confirmButtonColor: '#16a34a', // Tailwind's green-600
    });

    // Clear the input field
    setEmail('');
  };

  return (
    <section className="bg-green-50 py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Icon + Text */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-green-700 text-3xl">
            <FaEnvelopeOpenText />
            <h2 className="text-2xl sm:text-3xl font-bold">
              Subscribe to Our Health Newsletter
            </h2>
          </div>
          <p className="text-gray-700 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
            Get the latest offers, health tips, and updates from Medishop delivered straight to your inbox.
          </p>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full sm:w-2/3 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
