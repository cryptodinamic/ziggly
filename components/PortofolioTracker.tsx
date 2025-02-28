"use client";

import { useWallet } from "../contexts/WalletContext";
import { useWalletBalance } from "../hooks/useWalletBalance";

export default function PortfolioTracker() {  
  const { accounts } = useWallet(); // Added to check if user is logged in
  const { balanceData, loading, error } = useWalletBalance();
  const isConnected = accounts.length > 0; // Check if user is logged in

  const getTotalValue = () => {
    if (balanceData && balanceData.tokens && balanceData.tokens.length > 0) {
      return balanceData.tokens
        .reduce((sum, token) => sum + token.valueUSD, 0)
        .toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    }
    return "0.00";
  };

  const getTokenCount = () => {
    return balanceData && balanceData.tokens && balanceData.tokens.length > 0 ? balanceData.tokens.length : 0;
  };

  const getZigglyHoldings = () => {
    if (balanceData && balanceData.tokens && balanceData.tokens.length > 0) {
      const zigglyToken = balanceData.tokens.find((token) => token.tokenName === "PREZIGGLY");
      return zigglyToken ? zigglyToken.balance.toLocaleString() : "0";
    }
    return "0";
  };

  const hasZiggly = parseFloat(getZigglyHoldings().replace(/,/g, "")) > 0;

  return (
    <div className="flex flex-col bg-black text-white overflow-hidden relative min-h-screen">
      <div className="mt-20 sm:mt-24 md:mt-28 relative">
        <header className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulseNeon relative z-10">
            Portfolio
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-200 text-center max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto animate-fadeIn relative z-10">
            Free with Ziggly Token!
          </p>
        </header>

        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-lg sm:text-xl md:text-2xl text-cyan-400 animate-pulse">
                    Loading...
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              <div className="bg-black/80 p-4 sm:p-6 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400">Total Value (Supra)</h3>
                <p className="mt-2 text-2xl sm:text-3xl md:text-4xl text-white">
                  {hasZiggly ? `$${getTotalValue()}` : "Locked"}
                </p>
                <span className="text-sm sm:text-base text-gray-400">Updated in real-time</span>
              </div>
              <div className="bg-black/80 p-4 sm:p-6 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-500/20">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-400">Tokens on Supra</h3>
                <p className="mt-2 text-2xl sm:text-3xl md:text-4xl text-white">{getTokenCount()}</p>
                <span className="text-sm sm:text-base text-gray-400">Supra Chain</span>
              </div>
              <div className="bg-black/80 p-4 sm:p-6 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400">Ziggly Holdings</h3>
                <p className="mt-2 text-2xl sm:text-3xl md:text-4xl text-white">{getZigglyHoldings()} ZIG</p>
                <span className="text-sm sm:text-base text-gray-400">Updated in real-time</span>
              </div>
            </div>

            {loading ? null : error ? (
              <div className="text-center mt-10">
                <p className="text-xl sm:text-2xl md:text-3xl text-red-400">{error}</p>
              </div>
            ) : hasZiggly && balanceData && balanceData.tokens && balanceData.tokens.length > 0 ? (
              <div className="mt-10 sm:mt-12 md:mt-16 bg-black/80 p-4 sm:p-6 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-500/20">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-400 mb-4 sm:mb-6">Your Supra Tokens</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 sm:py-3 text-gray-300">Token</th>
                        <th className="py-2 sm:py-3 text-gray-300">Balance</th>
                        <th className="py-2 sm:py-3 text-gray-300">Value (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {balanceData.tokens.map((token, index) => (
                        <tr key={index} className="border-b border-gray-700/50">
                          <td className="py-2 sm:py-3">{token.tokenName}</td>
                          <td className="py-2 sm:py-3">{token.balance.toLocaleString()}</td>
                          <td className="py-2 sm:py-3">${token.valueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center mt-10">
                {hasZiggly ? (
                  <p className="text-xl sm:text-2xl md:text-3xl text-red-400">No token balances available.</p>
                ) : isConnected ? (
                  <p className="text-xl sm:text-2xl md:text-3xl text-purple-400">
                    You need Ziggly in your balance to unlock this tool!
                  </p>
                ) : (
                  <p className="text-xl sm:text-2xl md:text-3xl text-gray-400">
                    Connect your wallet to view your portfolio.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <footer className="p-6 sm:p-8 md:p-10 text-center text-gray-400 bg-black border-t border-cyan-500/20">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg">Ziggly | Powered by Supra Chain</p>
        </footer>
      </div>
    </div>
  );
}