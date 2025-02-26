"use client";

import { useWallet } from "../contexts/WalletContext";
import { useWalletBalance } from "../hooks/useWalletBalance";
import Link from "next/link";

export default function Charts() {
  const { accounts, connectWallet } = useWallet();
  const { balanceData, loading, error } = useWalletBalance();
  const isConnected = accounts.length > 0;

  const getZigglyHoldings = () => {
    if (balanceData && balanceData.tokens && balanceData.tokens.length > 0) {
      const zigglyToken = balanceData.tokens.find((token) => token.tokenName === "PREZIGGLY");
      return zigglyToken ? zigglyToken.balance.toLocaleString() : "0";
    }
    return "0";
  };

  const hasZiggly = parseFloat(getZigglyHoldings().replace(/,/g, "")) > 0;

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white overflow-hidden">
      {/* Main Content - Starts Below Navbar */}
      <div className="mt-20 sm:mt-24 md:mt-28">
        {/* Header Section */}
        <header className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulseNeon relative z-10">
            Live Token Charts
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-200 text-center max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto animate-fadeIn relative z-10">
            Free with Ziggly Token!
          </p>
          {/* Address Input Placeholder */}
          <div className="mt-6 sm:mt-8 max-w-full sm:max-w-md md:max-w-lg mx-auto relative z-10">
            <input
              type="text"
              placeholder="Enter Token Address (e.g. 0x1234...)"
              className="w-full p-3 sm:p-4 bg-black/80 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          {!isConnected && (
            <div className="mt-6 sm:mt-8 flex justify-center z-20">
              <button
                onClick={connectWallet}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-lg sm:text-xl md:text-2xl"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </header>

        {/* Charts & Trade Section */}
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-[#1a1a1a] relative">
          <div className="max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-lg sm:text-xl md:text-2xl text-cyan-400 animate-pulse">
                    Loading your charts...
                  </p>
                </div>
              </div>
            )}

            {/* Token Info Box */}
            <div className="bg-black/80 p-4 sm:p-6 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20 mb-10 sm:mb-12 md:mb-16">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-4 sm:mb-6">Token Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-sm sm:text-base text-gray-400">
                    Name: <span className="text-white">Ziggly</span>
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    Ticker: <span className="text-white">ZIG</span>
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    Address: <span className="text-white">0x1234...</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm sm:text-base text-gray-400">
                    Total Supply: <span className="text-white">1,000,000 ZIG</span>
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    Liquidity: <span className="text-white">$250,000</span>
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    Market Cap: <span className="text-white">$500,000</span>
                  </p>
                </div>
              </div>
            </div>

            {loading ? null : error ? (
              <div className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl text-red-400">{error}</p>
              </div>
            ) : isConnected && hasZiggly ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                {/* Price Chart - Larger */}
                <div className="lg:col-span-2 bg-black/80 p-4 sm:p-6 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400 mb-4 sm:mb-6">Token Price (Live)</h3>
                  <div className="h-64 sm:h-80 md:h-96 bg-gray-900/50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400 text-sm sm:text-base">[Chart Placeholder - Live Price Line Graph]</p>
                  </div>
                </div>

                {/* Trade Box - Smaller */}
                <div className="lg:col-span-1 bg-black/80 p-4 sm:p-6 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-500/20">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-400 mb-4 sm:mb-6">Trade ZIG</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="text-sm sm:text-base text-gray-400">Amount</label>
                      <input
                        type="number"
                        placeholder="0.00 ZIG"
                        className="w-full p-2 sm:p-3 mt-2 bg-black/50 border border-pink-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-cyan-500 text-black font-bold py-2 sm:py-3 rounded-lg hover:bg-cyan-400 transition">
                        Buy
                      </button>
                      <button className="bg-pink-500 text-black font-bold py-2 sm:py-3 rounded-lg hover:bg-pink-400 transition">
                        Sell
                      </button>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Price: <span className="text-white">$0.50</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {isConnected ? (
                  <div>
                    <p className="text-xl sm:text-2xl md:text-3xl text-purple-400 mb-4">Buy Ziggly to Unlock!</p>
                    <Link href="https://www.pumpit.pro/token/0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY">
                      <button className="mt-6 sm:mt-8 md:mt-10 px-8 sm:px-10 md:px-12 lg:px-14 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl lg:text-2xl bg-pink-500 font-bold rounded-full shadow-lg shadow-pink-500/50 hover:bg-cyan-500 hover:shadow-cyan-500/50 transition-all duration-300">
                        Get Ziggly Now!
                      </button>
                    </Link>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="p-6 sm:p-8 md:p-10 text-center text-gray-400 bg-black border-t border-cyan-500/20">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg">Ziggly | Powered by Supra Chain</p>
        </footer>
      </div>
    </div>
  );
}