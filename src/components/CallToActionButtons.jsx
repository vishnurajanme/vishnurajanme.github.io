import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CallToActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 z-10 w-full max-w-sm sm:max-w-md">
      <motion.div
        className="w-full rounded-full"
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 80px rgba(142, 45, 226, 0.7)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/about"
          className="block w-full text-center bg-purple-700 text-white border-transparent font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-all duration-300"
        >
          Know More
        </Link>
      </motion.div>
      <motion.div
        className="w-full rounded-full"
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 80px rgba(142, 45, 226, 0.7)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/contact"
          className="block w-full text-center bg-transparent border-2 border-purple-700 text-purple-400 font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-all duration-300"
        >
          Contact Me
        </Link>
      </motion.div>
    </div>
  );
}
