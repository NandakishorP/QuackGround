"use client";

import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaDiscord, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 border-t border-yellow-400">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <Image src="/2.png" alt="QuackGround Logo" width={50} height={50} />
          <h1 className="text-yellow-400 font-bold text-lg md:text-xl">QuackGround</h1>
        </div>

        {/* Quick Links */}
        <div className="flex space-x-6 text-gray-300 font-medium">
          <Link href="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link href="/create" className="hover:text-yellow-400 transition">Create NFT</Link>
          <Link href="/marketplace" className="hover:text-yellow-400 transition">Marketplace</Link>
          <Link href="/my-nfts" className="hover:text-yellow-400 transition">My NFTs</Link>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-gray-300">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <FaTwitter size={20} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <FaDiscord size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-800">
        &copy; {new Date().getFullYear()} QuackGround. All rights reserved.
      </div>
    </footer>
  );
}
