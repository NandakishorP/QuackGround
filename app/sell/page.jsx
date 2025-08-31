"use client";
import { useState } from "react";

export default function Page() {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const nfts = [
    { id: 1, name: "Golden Duck", collection: "Crypto Birds", rarity: "Rare", image: "/nft1.png" },
    { id: 2, name: "Crypto Pond", collection: "Water World", rarity: "Epic", image: "/nft2.png" },
    { id: 3, name: "Rare Feather", collection: "Crypto Birds", rarity: "Legendary", image: "/nft3.png" },
  ];

  const handleSelect = (nft) => {
    setSelectedNFT(nft);
    setPrice("");
    setQuantity(1);
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) {
      alert("Enter a valid price!");
      return;
    }
    if (!quantity || quantity <= 0) {
      alert("Enter a valid quantity!");
      return;
    }
    setShowConfirm(true);
  };

  const confirmListing = () => {
    setShowConfirm(false);
    setSelectedNFT(null);
    setPrice("");
    setQuantity(1);
    setSuccessMessage("Your NFT has been listed! Check it on the QuackGround Marketplace.");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-yellow-400">
        Sell Your NFT on QuackGround
      </h1>

      {!selectedNFT ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-gray-900 rounded-2xl p-4 shadow-lg hover:shadow-yellow-500/40 cursor-pointer transform hover:scale-105 transition duration-300"
              onClick={() => handleSelect(nft)}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="rounded-xl w-full h-56 object-cover mb-3"
              />
              <h2 className="text-lg font-semibold">{nft.name}</h2>
              <p className="text-sm text-gray-400">{nft.collection} • {nft.rarity}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md w-full bg-gray-900 p-6 rounded-3xl shadow-2xl flex flex-col items-center mb-10">
          <button
            onClick={() => setSelectedNFT(null)}
            className="self-start mb-4 text-sm text-yellow-400 hover:underline"
          >
            ← Back to NFTs
          </button>

          <img
            src={selectedNFT.image}
            alt={selectedNFT.name}
            className="rounded-2xl w-full h-64 object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{selectedNFT.name}</h2>
          <p className="text-gray-400 mb-4">{selectedNFT.collection} • {selectedNFT.rarity}</p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <label className="block text-sm mb-2">Price (DuckChain tokens)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 10.5"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none mb-4 transition"
            />

            <label className="block text-sm mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 1"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none mb-6 transition"
            />

            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-yellow-300 transition"
            >
              List on QuackGround
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Confirm Listing</h3>
            <p className="text-gray-300 mb-6">
              You're listing <span className="font-semibold">{selectedNFT.name}</span> for <span className="font-semibold">{price} DuckChain tokens</span> (Quantity: {quantity})
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmListing}
                className="flex-1 py-2 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-md w-full bg-gray-900 p-4 rounded-2xl shadow-lg text-center text-green-400 mb-10">
          {successMessage}
        </div>
      )}
    </div>
  );
}
