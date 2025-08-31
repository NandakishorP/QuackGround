"use client";
import { useState } from "react";

export default function CreateNFTPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [proceeds, setProceeds] = useState(0);

  const handleGenerate = async () => {
    if (!prompt) return alert("Enter a prompt to generate an image!");
    setIsGenerating(true);
    setGeneratedImage(null);

    // Simulate AI image generation
    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 1000);
      setGeneratedImage(`https://picsum.photos/seed/${randomId}/500/500`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleMint = () => {
    if (!generatedImage) return;
    const nft = { id: mintedNFTs.length + 1, image: generatedImage, prompt, profit: 0 };
    setMintedNFTs([...mintedNFTs, nft]);
    setPrompt("");
    setGeneratedImage(null);
    alert("NFT minted! You can see it in your profile.");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-8 text-center">
        Create NFT with AI
      </h1>

      {/* Prompt Input */}
      <div className="w-full max-w-xl mb-8">
        <label className="block text-sm mb-2">Enter AI Prompt</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A golden duck flying over a rainbow pond"
          className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none mb-4 transition"
        />
        <button
          onClick={handleGenerate}
          className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-yellow-300 transition"
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </button>
      </div>

      {/* Generated Image */}
      {generatedImage && (
        <div className="w-full max-w-md bg-gray-900 p-6 rounded-2xl shadow-lg mb-8 flex flex-col items-center">
          <img src={generatedImage} alt="Generated NFT" className="rounded-xl w-full h-auto mb-4" />
          <div className="flex gap-4 w-full">
            <button
              onClick={handleMint}
              className="flex-1 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition"
            >
              Mint NFT
            </button>
            <button
              onClick={() => setGeneratedImage(null)}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Minted NFTs / Profile */}
      {mintedNFTs.length > 0 && (
        <div className="w-full max-w-6xl mt-10">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
            Your Minted NFTs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mintedNFTs.map((nft) => (
              <div
                key={nft.id}
                className="bg-gray-900 p-4 rounded-2xl shadow-lg flex flex-col items-center"
              >
                <img src={nft.image} alt={`NFT ${nft.id}`} className="rounded-xl w-full h-48 object-cover mb-3" />
                <h3 className="font-semibold text-lg mb-1 truncate">{nft.prompt}</h3>
                <p className="text-gray-400 text-sm">Profit: {nft.profit} $DUCK</p>
              </div>
            ))}
          </div>
          <p className="text-yellow-400 text-center mt-6 font-semibold">
            Total Proceeds: {mintedNFTs.reduce((acc, nft) => acc + nft.profit, 0)} $DUCK
          </p>
        </div>
      )}
    </div>
  );
}
