
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Compass } from 'lucide-react';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, staggerChildren: 0.2, ease: 'easeOut' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function NotFound() {
  return (
    <motion.section
      className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Premium Illustration */}
        <motion.div variants={itemVariants} className="relative mb-10">
          <img
            src="https://via.placeholder.com/500x400?text=404+Journey+Lost"
            alt="404 Premium Illustration"
            className="mx-auto w-80 h-64 object-cover rounded-2xl shadow-xl border border-gray-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent rounded-2xl" />
          <Compass
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-amber-400 animate-pulse"
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Error Message */}
        <motion.h1
          className="text-5xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-4"
          variants={itemVariants}
        >
          404 - Journey Not Found
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          It seems you've ventured to an uncharted destination. Let's guide you back to your next adventure.
        </motion.p>

        {/* Navigation Options */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold text-sm uppercase tracking-wide hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>

        </motion.div>


      </div>
    </motion.section>
  );
}

export default NotFound;
