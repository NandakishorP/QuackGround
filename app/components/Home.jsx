import React from "react";
import Create from "./Create";
import TopCreator from "./TopCreator";
import Footer from "./Footer";

const Home = () => {
  const collections = [
    {
      id: 1,
      name: "Cool Ducks",
      image: "/1.png",
      floor: "0.002 ETH",
      floorChange: "-7.2%",
      volume: "205 ETH",
      volumeChange: "+143.4%",
      items: "36.7K",
      owners: "42.6K",
    },
    {
      id: 2,
      name: "Crypto Quacks",
      image: "/1.png",
      floor: "0.001 ETH",
      floorChange: "+2.5%",
      volume: "79 ETH",
      volumeChange: "-6.2%",
      items: "12.4K",
      owners: "8.3K",
    },
    {
      id: 3,
      name: "Duckverse",
      image: "/1.png",
      floor: "0.005 ETH",
      floorChange: "-1.1%",
      volume: "42 ETH",
      volumeChange: "-46.5%",
      items: "519",
      owners: "178",
    },
    {
      id: 4,
      name: "Golden Ducks",
      image: "/1.png",
      floor: "0.003 ETH",
      floorChange: "+10.5%",
      volume: "20 ETH",
      volumeChange: "+12.3%",
      items: "6.5K",
      owners: "9.8K",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Trending Collections Section */}
      <section className="px-4 md:px-8 py-16">
        <h3 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 text-center">
           Our Top Collection in Last 7 Days
        </h3>

        <div className="overflow-x-auto rounded-xl  shadow-lg">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-900 sticky top-0 z-10">
              <tr className="text-yellow-400">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Collection</th>
                <th className="p-3 text-center">Floor Price</th>
                <th className="p-3 text-center">Floor Change</th>
                <th className="p-3 text-center">Volume</th>
                <th className="p-3 text-center">Volume Change</th>
                <th className="p-3 text-center">Items</th>
                <th className="p-3 text-center">Owners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {collections.map((col, i) => (
                <tr
                  key={col.id}
                  className="hover:bg-gray-900 transition"
                >
                  <td className="p-3 text-gray-400">{i + 1}</td>
                  <td className="p-3 flex items-center space-x-3">
                    <img
                      src={col.image}
                      alt="Collection"
                      className="w-10 h-10 rounded-lg border border-yellow-400"
                    />
                    <span className="font-semibold">{col.name}</span>
                  </td>
                  <td className="p-3 text-center">{col.floor}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      col.floorChange.startsWith("+")
                        ? "text-green-400"
                        : "text-red-500"
                    }`}
                  >
                    {col.floorChange}
                  </td>
                  <td className="p-3 text-center">{col.volume}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      col.volumeChange.startsWith("+")
                        ? "text-green-400"
                        : "text-red-500"
                    }`}
                  >
                    {col.volumeChange}
                  </td>
                  <td className="p-3 text-center">{col.items}</td>
                  <td className="p-3 text-center">{col.owners}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </section>
      <TopCreator/>
      <Create/>
      <Footer/>
    </div>
  );
};

export default Home;
