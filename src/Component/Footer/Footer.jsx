import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  const smoothScrollTo = (targetY, duration) => {
    const startY = window.scrollY;
    const distanceY = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startY + distanceY * easeInOutQuad(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    requestAnimationFrame(animation);
  };

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const section = document.querySelector(id);
    if (section) {
      const offset = section.offsetTop - 60; // adjust for fixed header if any
      smoothScrollTo(offset, 2000); // 2000ms = 2 seconds
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* About MediMarket */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-green-700">MediMarket</h3>
          <p className="text-gray-400 leading-relaxed">
            Your trusted online pharmacy for authentic medicines, great prices, and fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
            <li><a href="#categories" onClick={(e) => handleSmoothScroll(e, '#categories')} className="hover:text-green-400 transition">Categories</a></li>
            <li><a href="#discounted" onClick={(e) => handleSmoothScroll(e, '#discounted')} className="hover:text-green-400 transition">Discounted Products</a></li>
            <li><a href="/shop" className="hover:text-green-400 transition">Available Cars</a></li>
            <li><a href="/contact" className="hover:text-green-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
          <p>Email: <a href="mailto:support@medimarket.com" className="hover:text-green-400 transition">support@medimarket.com</a></p>
          <p>Phone: <a href="tel:+01626080591" className="hover:text-green-400 transition">+01626080591</a></p>
          <p>Address: 123 Health St, Wellness City</p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
          <div className="flex space-x-4 text-gray-400">
            <a href="https://www.facebook.com/sheitomi.kothay/" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-green-400 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-green-400 transition">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-green-400 transition">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.linkedin.com/in/repon-hasan/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-green-400 transition">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MediMarket. All rights reserved.
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 2s ease forwards;
          opacity: 0;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
