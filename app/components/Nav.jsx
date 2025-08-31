"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create NFT" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/my-nfts", label: "My NFTs" },
  ];

  return (
    <nav className="px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-black border-b border-yellow-400 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
         <Image
  src="/2.png"
  alt="QuackGround Logo"
  width={70}       // bigger size
  height={70}
  className="object-contain"
  style={{ maxWidth: "100%", height: "auto" }} // responsive for small screens
/>


         <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
  QuackGround
</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-gray-300 font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-yellow-400 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-500/30 transition">
            Connect Wallet
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-yellow-400 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mt-4 flex flex-col space-y-4 text-gray-300 font-medium bg-black rounded-lg p-4 border border-gray-800"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-400 transition"
              >
                {link.label}
              </Link>
            ))}
            <button className="w-full px-4 py-2 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-500/30 transition">
              Connect Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
