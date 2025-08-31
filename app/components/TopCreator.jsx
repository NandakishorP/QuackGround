"use client";

import Image from "next/image";
import { FaTwitter, FaEthereum } from "react-icons/fa";

const topCreators = [
  { id: 1, name: "Alice Johnson", username: "@aliceNFT", avatar: "/avatars/alice.jpg", nftCount: 120, earnings: "15.2 ETH" },
  { id: 2, name: "Bob Smith", username: "@bobNFT", avatar: "/avatars/bob.jpg", nftCount: 98, earnings: "12.5 ETH" },
  { id: 3, name: "Charlie Lee", username: "@charlieNFT", avatar: "/avatars/charlie.jpg", nftCount: 85, earnings: "10.8 ETH" },
  { id: 4, name: "Diana Rose", username: "@dianaNFT", avatar: "/avatars/diana.jpg", nftCount: 75, earnings: "9.6 ETH" },
];

export default function TopCreator() {
  return (
    <section className="py-16 bg-black/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-12 text-center">
          Top NFT Creators
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {topCreators.map((creator, index) => (
            <div
              key={creator.id}
              className="relative bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-800 hover:border-yellow-400/30"
            >
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
                #{index + 1}
              </div>

              {/* Avatar */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-30"></div>
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  width={100}
                  height={100}
                  className="relative rounded-full border-4 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300"
                />
              </div>

              {/* Creator Info */}
              <h3 className="text-xl font-semibold text-white mb-1 text-center">{creator.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{creator.username}</p>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 w-full">
                <div className="bg-gray-800 px-3 py-2 rounded-lg flex-1 text-center min-w-0">
                  <span className="text-yellow-400 font-medium text-sm block">{creator.nftCount} NFTs</span>
                </div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg flex-1 text-center min-w-0">
                  <span className="flex items-center justify-center text-orange-400 font-medium text-sm">
                    <FaEthereum className="mr-1 flex-shrink-0" /> {creator.earnings}
                  </span>
                </div>
              </div>

              {/* Follow Button */}
              <a
                href={`https://twitter.com/${creator.username.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaTwitter className="mr-2 flex-shrink-0" /> Follow
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
