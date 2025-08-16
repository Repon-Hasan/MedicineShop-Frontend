import React from 'react';
import { useNavigate } from 'react-router'; // Correct import for React Router v6+
import { motion } from 'framer-motion';
import error from '../assets/error.jpeg'
function ErrorComponent() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row items-center p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={error}// You can replace with your own image
            alt="Error Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-700 mb-4 text-lg">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            If you think this is a mistake, please contact support or try navigating back to the homepage.
          </p>
          <button
            onClick={handleGoHome}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded shadow-md transition duration-300"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ErrorComponent;
