"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useWalletBalance } from "../hooks/useWalletBalance";
import Link from "next/link";

export default function Charts() {
  const { accounts, connectWallet } = useWallet();
  const { balanceData, loading, error } = useWalletBalance();
  const isConnected = accounts.length > 0;

  // State for token price, chart simulation, and trade amounts for Ziggly on Supra Chain
  const [tokenPrice, setTokenPrice] = useState<number>(0.50);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [tradeAmount, setTradeAmount] = useState<string>("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [chartPeriod, setChartPeriod] = useState<string>("1D");

  // Simulate price updates (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = tokenPrice + (Math.random() - 0.5) * 0.05;
      const newChange = ((newPrice - 0.50) / 0.50) * 100;
      setTokenPrice(newPrice);
      setPriceChange(newChange);
    }, 5000);
    return () => clearInterval(interval);
  }, [tokenPrice]);

  const getZigglyHoldings = () => {
    if (balanceData && balanceData.tokens && balanceData.tokens.length > 0) {
      const zigglyToken = balanceData.tokens.find((token) => token.tokenName === "PREZIGGLY");
      return zigglyToken ? zigglyToken.balance.toLocaleString() : "0";
    }
    return "0";
  };

  const hasZiggly = parseFloat(getZigglyHoldings().replace(/,/g, "")) > 0;

  const handleConnectWallet = async () => {
    if (!connectWallet) {
      console.error("connectWallet function is not available in useWallet hook.");
      alert("Wallet connection is not supported. Please check your setup.");
      return;
    }

    console.log("Connect Wallet button clicked! Attempting to connect...");
    try {
      await connectWallet();
      console.log("Wallet connected successfully:", accounts);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      alert("Failed to connect wallet. Please check the console for details.");
    }
  };

  const handleTrade = (type: "buy" | "sell") => {
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
      alert("Please enter a valid amount to trade.");
      return;
    }
    const amount = parseFloat(tradeAmount);
    const totalValue = amount * tokenPrice;
    console.log(`Executing ${type} order for ${amount} ZIG at $${tokenPrice} each. Total: $${totalValue.toFixed(2)}`);
    alert(`Trade executed: ${type} ${amount} ZIG for $${totalValue.toFixed(2)} on Supra Chain`);
    setTradeAmount("");
    setTradeType(type);
  };

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white overflow-hidden">
      <div className="mt-20 sm:mt-24 md:mt-28">
        <header className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M0 0h20v20H0V0zm1 1h18v18H1V1z\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulse relative z-10">
            Live Token Charts
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-200 text-center max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto animate-fadeIn relative z-10">
            Free with Ziggly Token!
          </p>
          <div className="mt-6 sm:mt-8 max-w-full sm:max-w-md md:max-w-lg mx-auto relative z-10">
            <input
              type="text"
              placeholder="Enter Token Address (e.g. 0x1234...)"
              className="w-full p-3 sm:p-4 bg-black/80 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          {!isConnected && (
            <div className="mt-6 sm:mt-8 flex justify-center relative z-20">
              <button
                onClick={handleConnectWallet}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-lg sm:text-xl md:text-2xl cursor-pointer"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </header>

        <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 bg-[#1a1a1a] relative">
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-xl text-cyan-400 animate-pulse">Loading trading data...</p>
                </div>
              </div>
            )}

            <div className="bg-black/80 p-6 sm:p-8 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-6">Ziggly (ZIG) Trading Overview on Supra</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-base sm:text-lg text-gray-400">Name: <span className="text-white">Ziggly</span></p>
                  <p className="text-base sm:text-lg text-gray-400">Ticker: <span className="text-white">ZIG</span></p>
                  <p className="text-base sm:text-lg text-gray-400">Price: <span className={`${priceChange < 0 ? "text-red-500" : "text-green-500"}`}>${tokenPrice.toFixed(2)} ({priceChange.toFixed(2)}%)</span></p>
                </div>
                <div>
                  <p className="text-base sm:text-lg text-gray-400">Market Cap: <span className="text-white">$500,000</span></p>
                  <p className="text-base sm:text-lg text-gray-400">Liquidity Pool: <span className="text-white">$250,000</span></p>
                  <p className="text-base sm:text-lg text-gray-400">24h Volume: <span className="text-white">$100,000</span></p>
                </div>
                <div>
                  <p className="text-base sm:text-lg text-gray-400">Total Supply: <span className="text-white">1,000,000 ZIG</span></p>
                  <p className="text-base sm:text-lg text-gray-400">Circulating Supply: <span className="text-white">800,000 ZIG</span></p>
                  <p className="text-base sm:text-lg text-gray-400">Holders: <span className="text-white">10,000</span></p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => console.log("View Detailed Stats clicked")}
                  className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-all duration-300 text-sm sm:text-base"
                >
                  View Detailed Stats
                </button>
              </div>
            </div>

            {loading ? null : error ? (
              <div className="text-center">
                <p className="text-2xl sm:text-3xl text-red-400">{error}</p>
              </div>
            ) : isConnected && hasZiggly ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black/80 p-6 sm:p-8 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6">Ziggly Price Chart (Live) on Supra</h3>
                  <div className="h-[500px] bg-gray-900/50 rounded-2xl flex items-center justify-center">
                    <p className="text-gray-400 text-base">[Interactive Chart Placeholder - Live Candlestick & Line Graph]</p>
                  </div>
                  <div className="mt-4 flex justify-between text-sm sm:text-base text-gray-400">
                    <button
                      onClick={() => setChartPeriod("1D")}
                      className={`px-2 py-1 rounded ${chartPeriod === "1D" ? "bg-cyan-500 text-black" : "hover:bg-gray-700"}`}
                    >
                      1D
                    </button>
                    <button
                      onClick={() => setChartPeriod("1W")}
                      className={`px-2 py-1 rounded ${chartPeriod === "1W" ? "bg-cyan-500 text-black" : "hover:bg-gray-700"}`}
                    >
                      1W
                    </button>
                    <button
                      onClick={() => setChartPeriod("1M")}
                      className={`px-2 py-1 rounded ${chartPeriod === "1M" ? "bg-cyan-500 text-black" : "hover:bg-gray-700"}`}
                    >
                      1M
                    </button>
                    <button
                      onClick={() => setChartPeriod("1Y")}
                      className={`px-2 py-1 rounded ${chartPeriod === "1Y" ? "bg-cyan-500 text-black" : "hover:bg-gray-700"}`}
                    >
                      1Y
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-1 bg-black/80 p-6 sm:p-8 rounded-2xl border border-pink-500/30 shadow-2xl shadow-pink-500/20">
                  <h3 className="text-2xl sm:text-3xl font-bold text-pink-400 mb-6">Trade Ziggly on Supra</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setTradeType("buy")}
                        className={`w-1/2 py-3 rounded-lg font-bold transition-all duration-300 ${tradeType === "buy" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30" : "bg-gray-700 text-white hover:bg-gray-600"}`}
                      >
                        Buy ZIG
                      </button>
                      <button
                        onClick={() => setTradeType("sell")}
                        className={`w-1/2 py-3 rounded-lg font-bold transition-all duration-300 ${tradeType === "sell" ? "bg-pink-500 text-black shadow-lg shadow-pink-500/30" : "bg-gray-700 text-white hover:bg-gray-600"}`}
                      >
                        Sell ZIG
                      </button>
                    </div>
                    <div>
                      <label className="text-base sm:text-lg text-gray-400">Amount (ZIG)</label>
                      <input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="0.00 ZIG"
                        className="w-full p-3 sm:p-4 mt-2 bg-black/50 border border-pink-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-400"
                      />
                      <p className="mt-2 text-sm sm:text-base text-gray-400">
                        Max Balance: {getZigglyHoldings()} ZIG
                      </p>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => handleTrade(tradeType)}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all duration-300 text-lg sm:text-xl"
                      >
                        {tradeType === "buy" ? "Confirm Buy Order" : "Confirm Sell Order"}
                      </button>
                      <div className="space-y-2">
                        <p className="text-base sm:text-lg text-gray-400">
                          Current Price: <span className="text-white">${tokenPrice.toFixed(2)}</span>
                        </p>
                        <p className="text-base sm:text-lg text-gray-400">
                          Est. Value: <span className="text-white">${(parseFloat(tradeAmount) || 0) * tokenPrice.toFixed(2)}</span>
                        </p>
                        <p className="text-base sm:text-lg text-gray-400">
                          Your Balance: <span className="text-white">{getZigglyHoldings()} ZIG</span>
                        </p>
                        <p className="text-base sm:text-lg text-gray-400">
                          24h Change: <span className={`${priceChange < 0 ? "text-red-500" : "text-green-500"}`}>{priceChange.toFixed(2)}%</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {isConnected ? (
                  <div>
                    <p className="text-2xl sm:text-3xl text-purple-400 mb-6">Hold Ziggly to Access Supra Trading!</p>
                    <Link href="https://www.pumpit.pro/token/0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY">
                      <button className="px-12 py-4 text-xl sm:text-2xl bg-pink-500 font-bold rounded-full shadow-lg shadow-pink-500/50 hover:bg-cyan-500 hover:shadow-cyan-500/50 transition-all duration-300">
                        Get Ziggly on Supra Now!
                      </button>
                    </Link>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <footer className="p-6 sm:p-8 md:p-10 text-center text-gray-400 bg-black border-t border-cyan-500/20">
          <p className="text-sm sm:text-base md:text-lg">Ziggly Trading Platform | Powered by Supra Chain | © 2025 SupraTrade</p>
        </footer>
      </div>
    </div>
  );
}