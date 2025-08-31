"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Hom1() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Navbar */}
     

      {/* Hero Section */}
  <section className="flex flex-col md:flex-row items-center justify-between py-16 px-4 sm:px-6 lg:px-20 xl:px-32">
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="md:w-1/2 space-y-6"
  >
    <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
      AI-Powered NFT Marketplace
    </h2>
    <p className="text-gray-300 text-lg max-w-md">
      Create, mint, and trade NFTs seamlessly on DuckChain using $DUCK tokens.
    </p>
    <div className="flex space-x-4">
      <Link
        href="/marketplace"
        className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-md hover:bg-orange-500 hover:shadow-orange-500/40 transition"
      >
        Explore Marketplace
      </Link>
      <Link
        href="/create"
        className="px-6 py-3 bg-transparent border border-yellow-400 text-yellow-400 font-bold rounded-xl hover:bg-yellow-400 hover:text-black transition"
      >
        Create NFT
      </Link>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1 }}
    className="md:w-1/2 flex justify-center mt-10 md:mt-0"
  >
    <Image
      src="/2.png"
      alt="QuackGround Logo Large"
      width={300}
      height={300}
      className="drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]"
    />
  </motion.div>
</section>

      {/* Featured NFTs */}
     <section className="px-8 py-16 bg-black/90">
      
      {/* Heading */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-12 text-center"
      >
        Featured NFTs
      </motion.h3>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((id) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gray-900 border border-yellow-400 rounded-2xl p-5 flex flex-col items-center hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300"
          >
            {/* NFT Image Placeholder */}
            <div className="h-48 w-full bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-500">NFT #{id}</span>
            </div>

            {/* NFT Info */}
            <p className="text-lg font-semibold text-white mb-1 text-center">Cool Duck NFT #{id}</p>
            <p className="text-gray-400 mb-4 text-center">$DUCK 10</p>

            {/* Buy Button */}
            <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200">
              Buy Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
     
    </div>
  );
}
