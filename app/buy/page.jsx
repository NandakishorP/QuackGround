"use client";
import { useState } from "react";

export default function MarketplacePage() {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Dummy marketplace NFTs
  const marketplaceNFTs = [
    { id: 1, name: "Golden Duck", collection: "Crypto Birds", rarity: "Rare", image: "/nft1.png", price: 10 },
    { id: 2, name: "Crypto Pond", collection: "Water World", rarity: "Epic", image: "/nft2.png", price: 15 },
    { id: 3, name: "Rare Feather", collection: "Crypto Birds", rarity: "Legendary", image: "/nft3.png", price: 25 },
    { id: 4, name: "Silver Duckling", collection: "Crypto Birds", rarity: "Common", image: "/nft4.png", price: 5 },
  ];

  const handleSelect = (nft) => {
    setSelectedNFT(nft);
    setQuantity(1);
    setShowModal(true);
    setSuccessMessage("");
  };

  const handlePurchase = () => {
    if (!quantity || quantity <= 0) {
      alert("Enter a valid quantity");
      return;
    }
    setShowModal(false);
    setSelectedNFT(null);
    setSuccessMessage(`Successfully purchased ${quantity} ${selectedNFT.name}(s) for ${selectedNFT.price * quantity} $DUCK!`);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-10 text-center">
        QuackGround Marketplace
      </h1>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {marketplaceNFTs.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-900 rounded-3xl p-4 shadow-lg cursor-pointer hover:shadow-yellow-500/40 transform hover:scale-105 transition duration-300"
            onClick={() => handleSelect(nft)}
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <h2 className="text-lg font-semibold mt-3">{nft.name}</h2>
            <p className="text-sm text-gray-400">{nft.collection} • {nft.rarity}</p>
            <p className="mt-2 font-semibold text-yellow-400">{nft.price} $DUCK</p>
          </div>
        ))}
      </div>

      {/* Purchase Modal */}
      {showModal && selectedNFT && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-3xl max-w-md w-full text-center shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Purchase NFT</h3>
            <img
              src={selectedNFT.image}
              alt={selectedNFT.name}
              className="rounded-2xl w-full h-64 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{selectedNFT.name}</h2>
            <p className="text-gray-400 mb-4">{selectedNFT.collection} • {selectedNFT.rarity}</p>
            <label className="block text-sm mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none mb-6 transition"
            />
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
              >
                Pay {selectedNFT.price * quantity} $DUCK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-md w-full bg-gray-900 p-4 rounded-2xl shadow-lg text-center text-green-400 mt-10 animate-fadeIn">
          {successMessage}
        </div>
      )}
    </div>
  );
}
