import React, { useState } from 'react';
import Swal from 'sweetalert2';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    // Normally here you'd handle backend submission

    // Show success alert
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for contacting us. We will get back to you shortly.',
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <section id="contact" className="bg-gray-100 py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Get in Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-600 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="text-gray-700">
            <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
            <p className="mb-4">
              Have questions about our products or services? Reach out to us anytime.
            </p>
            <ul className="space-y-3 text-sm">
              <li><strong>📞 Phone:</strong> <a href="tel:+01626080591" className="text-green-600 hover:underline">+01 626 080 591</a></li>
              <li><strong>📧 Email:</strong> <a href="mailto:support@medimarket.com" className="text-green-600 hover:underline">support@medimarket.com</a></li>
              <li><strong>🏢 Address:</strong> 123 Health Street, Wellness City, MediLand</li>
              <li><strong>🕐 Hours:</strong> Mon - Fri: 9am - 8pm | Sat - Sun: 10am - 6pm</li>
            </ul>

            {/* Google Maps Embed */}
            <div className="mt-6">
              <iframe
                title="MediMarket Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.873655223862!2d90.407143!3d23.791599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70f1adfb6cb%3A0xdeb62fef3b8d0101!2sDhaka!5e0!3m2!1sen!2sbd!4v1639981734715!5m2!1sen!2sbd"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
