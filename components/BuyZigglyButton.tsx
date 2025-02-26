"use client";

import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useTokenTransactions } from "../hooks/useTokenTransactions";

export const BuyZigglyButton: React.FC = () => {
  const { connectWallet, accounts, networkData, supraProvider } = useWallet();
  const { buyZiggly, loading, error, txHash, setError } = useTokenTransactions();
  const [amount, setAmount] = useState<string>(""); // Amount in SUPRA to spend (max_aptos)
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy"); // Track buy/sell action
  const [slippage, setSlippage] = useState<string>("1"); // Slippage percentage

  const handleConnect = async () => {
    console.log("Connecting wallet...");
    try {
      await connectWallet();
      console.log("Wallet connected:", accounts);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      alert("Failed to connect wallet. Check the console for details.");
    }
  };

  const handleTrade = async () => {
    if (!accounts.length) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!networkData || networkData.chainId !== "8") {
      alert("Please switch to Supra mainnet (chainId 8)!");
      return;
    }
    if (!supraProvider) {
      alert("Supra provider not available. Check wallet connection.");
      return;
    }

    const maxSupra = parseFloat(amount);
    if (isNaN(maxSupra) || maxSupra <= 0) {
      alert("Enter a valid amount of SUPRA to trade!");
      return;
    }

    const minZiggly = maxSupra * (1 - parseFloat(slippage) / 100); // Calculate minimum ZIG based on slippage

    console.log(`Starting ${tradeType} Ziggly with`, maxSupra, "SUPRA...");
    console.log("Minimum ZIG expected:", minZiggly);

    try {
      await buyZiggly(maxSupra, minZiggly);
      console.log(`${tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} Ziggly completed successfully!`);
      alert(`${tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} Ziggly successful! Check the transaction on SupraScan.`);
      setAmount(""); // Reset input after trade
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error ${tradeType}ing Ziggly:`, errorMessage);
      setError(`Failed to ${tradeType} Ziggly: ${errorMessage}`);
      alert(`Error during ${tradeType}: ${errorMessage}`);
    }
  };

  const presetAmounts = [1, 10, 25, 50]; // Preset SUPRA amounts in USD

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <div className="bg-black text-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md mx-auto border border-cyan-500/30 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 mb-6 sm:mb-8 relative z-10">
        {tradeType === "buy" ? "Buy Ziggly" : "Sell Ziggly"}
      </h2>

      {!accounts.length ? (
        <div className="relative z-10">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-lg sm:text-xl disabled:bg-gray-500 disabled:shadow-none"
          >
            Connect Starkey Supra Wallet
          </button>
        </div>
      ) : (
        <div className="relative z-10 space-y-6">
          <p className="text-cyan-200 text-sm sm:text-base text-center">
            Wallet: {accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}
          </p>
          <p className="text-cyan-200 text-sm sm:text-base text-center">
            Network: {networkData?.chainId === "8" ? "Supra Mainnet" : "Unknown Network"}
          </p>

          <div className="space-y-4">
            {/* Buy/Sell Toggle */}
            <div className="flex gap-4">
              <button
                onClick={() => setTradeType("buy")}
                className={`w-1/2 py-3 rounded-lg font-bold transition-all duration-300 ${tradeType === "buy" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30" : "bg-gray-700 text-white hover:bg-gray-600"}`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType("sell")}
                className={`w-1/2 py-3 rounded-lg font-bold transition-all duration-300 ${tradeType === "sell" ? "bg-pink-500 text-black shadow-lg shadow-pink-500/30" : "bg-gray-700 text-white hover:bg-gray-600"}`}
              >
                Sell
              </button>
            </div>

            {/* Amount Input and Balances */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-purple-400 text-sm sm:text-base font-bold">
                  Amount (SUPRA)
                </label>
                <span className="text-gray-400 text-sm sm:text-base">
                  Bal.: {tradeType === "buy" ? "0.0 SUPRA" : "0.0 ZIGGLY"}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  disabled={loading}
                  placeholder="0.00"
                  className="w-full p-3 sm:p-4 rounded-lg bg-black/80 text-white border border-pink-500/30 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 pr-16"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                  {tradeType === "buy" ? "SUPRA" : "ZIGGLY"}
                </span>
              </div>
              <button
                onClick={() => setAmount("0")} // Assuming "Max" resets or sets max balance (simplified)
                className="mt-2 px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base transition-all duration-300"
              >
                Max
              </button>
            </div>

            {/* Preset Amounts */}
            <div className="flex gap-2 flex-wrap">
              {presetAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handlePresetAmount(value)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base transition-all duration-300"
                >
                  {value} SUPRA
                </button>
              ))}
            </div>

            {/* Slippage */}
            <div className="flex justify-between items-center">
              <label className="text-purple-400 text-sm sm:text-base font-bold">Slippage:</label>
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                min="0.1"
                max="10"
                step="0.1"
                className="w-16 p-1 rounded-lg bg-black/80 text-white border border-pink-500/30 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm sm:text-base text-center"
              />
              <span className="text-gray-400 text-sm sm:text-base">%</span>
            </div>

            {/* Trade Button */}
            <button
              onClick={handleTrade}
              disabled={loading}
              className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all duration-300 text-lg sm:text-xl disabled:bg-gray-500 disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                tradeType === "buy" ? "Buy" : "Sell"
              )}
            </button>

            {error && (
              <p className="text-red-400 text-sm sm:text-base text-center mt-4">{error}</p>
            )}
            {txHash && (
              <p className="text-green-400 text-sm sm:text-base text-center mt-4">
                Success! View transaction:{" "}
                <a
                  href={`https://suprascan.io/tx/${txHash}/f?tab=advanced%20information`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-cyan-400 hover:text-pink-500 transition-colors duration-300"
                >
                  {txHash.slice(0, 6)}...{txHash.slice(-6)}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};