"use client";

import { motion } from "framer-motion";

export default function Create() {
  return (
    <section className="w-full  flex flex-col items-center justify-center text-center bg-black px-6 md:px-16 lg:px-32 py-20">
      
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6"
      >
        Create Your Own NFT
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10"
      >
        Turn your imagination into reality. Generate AI-powered art and mint it into your unique NFT in seconds. Simple, fast, and fully on-chain.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-10 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Start Creating
      </motion.button>
    </section>
  );
}
