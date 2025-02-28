"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { BCS } from "supra-l1-sdk";
import { LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Transaction {
  date: string;
  type: "Buy" | "Sell";
  price: number;
  volume: string;
  amount: string;
}

const CONTRACTS = {
  PUMP: "0xc2896ec7a6ad3ac8a50626db9b832a142647ff065af6b30a089f64627c0c4a2b",
  ZIGGLY: "0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495",
} as const;

const TOKEN_TYPES = {
  PREZIGGLY: `${CONTRACTS.ZIGGLY}::PREZIGGLY::PREZIGGLY`,
  ZIGGLY: `${CONTRACTS.ZIGGLY}::ZIGGLY::ZIGGLY`,
} as const;

const SUPRA_PER_ZIGGLY = 8976 / 32150000;
const SLIPPAGE = 0.98;

const INITIAL_CHART_DATA: ChartDataPoint[] = [
  { date: "06:00", open: 0.0055, high: 0.006, low: 0.0035, close: 0.004 },
  { date: "12:00", open: 0.004, high: 0.0045, low: 0.0038, close: 0.0042 },
  { date: "18:00", open: 0.0042, high: 0.0043, low: 0.0037, close: 0.0039 },
  { date: "00:00", open: 0.0039, high: 0.0041, low: 0.0036, close: 0.003895 },
];

const INITIAL_TX_DATA: Transaction[] = [
  { date: "4s", type: "Buy", price: 0.003895, volume: "$29.68", amount: "32.8 mil" },
  { date: "5s", type: "Buy", price: 0.003894, volume: "$18.65", amount: "20.6 mil" },
  { date: "5s", type: "Buy", price: 0.003893, volume: "$7.60", amount: "8.0 mil" },
];

export default function Charts() {
  const { accounts, supraProvider, networkData } = useWallet();
  const { balanceData, loading, error } = useWalletBalance();
  const [tradeAmount, setTradeAmount] = useState("");
  const [minExpected, setMinExpected] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [isLoading, setIsLoading] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const isConnected = accounts.length > 0; // Check if user is logged in

  useEffect(() => {
    if (!tradeAmount) {
      setMinExpected("");
      return;
    }

    const amount = parseFloat(tradeAmount);
    if (isNaN(amount)) return;

    const expected = tradeType === "buy"
      ? (amount / SUPRA_PER_ZIGGLY * SLIPPAGE).toFixed(2)
      : (amount * SUPRA_PER_ZIGGLY * SLIPPAGE).toFixed(2);
    setMinExpected(expected);
  }, [tradeAmount, tradeType]);

  const getBalance = (tokenName: "SUPRA" | "PREZIGGLY") => {
    return balanceData?.tokens?.find((t) => t.tokenName === tokenName)?.balance || 0;
  };

  {/*const hasZiggly = parseFloat(getBalance("PREZIGGLY").toLocaleString().replace(/,/g, "")) > 0;*/}
  
  const isDisabled = isConnected; // Disable buttons if logged in, regardless of Ziggly

  const createTransactionPayload = (
    method: "buy" | "sell",
    amountUnits: bigint,
    minUnits: bigint
  ): [string, number, string, string, string, string[], [Uint8Array, Uint8Array], { txExpiryTime: number }] => {
    return [
      accounts[0] || "0x0", // Default to "0x0" if no account
      0,
      CONTRACTS.PUMP,
      "pump",
      method,
      [TOKEN_TYPES.PREZIGGLY, TOKEN_TYPES.ZIGGLY],
      [BCS.bcsSerializeUint64(Number(amountUnits)), BCS.bcsSerializeUint64(Number(minUnits))],
      { txExpiryTime: Math.ceil(Date.now() / 1000) + 30 },
    ];
  };

  const handleTrade = async (type: "buy" | "sell") => {
    if (!supraProvider || networkData?.chainId !== "8") {
      setTradeError("Please switch to Supra Mainnet!");
      return;
    }

    const amount = parseFloat(tradeAmount);
    const minAmount = parseFloat(minExpected);
    if (!amount || !minAmount || amount <= 0 || minAmount <= 0) {
      setTradeError("Please enter valid amounts!");
      return;
    }

    setIsLoading(true);
    setTradeError(null);
    setTxHash(null);

    try {
      const balance = type === "buy" ? getBalance("SUPRA") : getBalance("PREZIGGLY");
      if (amount > balance) throw new Error(`Insufficient ${type === "buy" ? "SUPRA" : "ZIGGLY"} balance`);

      const units = BigInt(Math.floor(amount * 1e8));
      const minUnits = BigInt(Math.floor(minAmount * 1e8));
      const payload = createTransactionPayload(type, units, minUnits);

      const rawTxData = await supraProvider.createRawTransactionData(payload);
      if (!rawTxData?.rawTransaction) throw new Error("Failed to create transaction data");

      await supraProvider.sendTransaction({
        data: { rawTransaction: rawTxData.rawTransaction },
      });

      const simulatedHash = `simulated_${Date.now()}`;
      setTxHash(simulatedHash);
      alert(`Successfully ${type === "buy" ? "bought" : "sold"} ZIGGLY!`);
    } catch (err) {
      setTradeError(err instanceof Error ? err.message : "Transaction failed");
      console.error(err);
    } finally {
      setIsLoading(false);
      setTradeAmount("");
      setMinExpected("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white font-sans">
      {/* Header */}
      <header className="p-6 bg-gray-950 shadow-lg">
        {/* Removed Connect Wallet button */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-24 max-w-7xl mx-auto animate-fade-in">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-xl text-red-400">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[7fr,3fr] gap-8">
            {/* Chart Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Ziggly Price</h3>
              <LineChart
                width={700}
                height={350}
                data={INITIAL_CHART_DATA}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[0.003, 0.006]} stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                <Line dataKey="close" type="monotone" stroke="#22d3ee" strokeWidth={2} dot={false} />
              </LineChart>
              {/* Transactions */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Recent Trades</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-300">
                    <thead className="border-b border-gray-700">
                      <tr>
                        <th className="py-2 px-3 text-left">Time</th>
                        <th className="py-2 px-3 text-left">Type</th>
                        <th className="py-2 px-3 text-left">Price</th>
                        <th className="py-2 px-3 text-left">Volume</th>
                        <th className="py-2 px-3 text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INITIAL_TX_DATA.map((tx, i) => (
                        <tr key={i} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <td className="py-2 px-3">{tx.date}</td>
                          <td className={`py-2 px-3 ${tx.type === "Buy" ? "text-green-400" : "text-red-400"}`}>
                            {tx.type}
                          </td>
                          <td className="py-2 px-3">${tx.price.toFixed(6)}</td>
                          <td className="py-2 px-3">{tx.volume}</td>
                          <td className="py-2 px-3">{tx.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Trade Panel */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4 text-center">Trade Ziggly</h3>
              <div className="space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setTradeType("buy")}
                    disabled={isDisabled}
                    className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                      tradeType === "buy" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeType("sell")}
                    disabled={isDisabled}
                    className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                      tradeType === "sell" ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Sell
                  </button>
                </div>

                {/* Switch Button */}
                <button
                  onClick={() => setTradeType(tradeType === "buy" ? "sell" : "buy")}
                  disabled={isDisabled}
                  className={`w-full py-2 bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600 transition-all transform hover:scale-102 ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Switch to {tradeType === "buy" ? "ZIGGLY" : "SUPRA"}
                </button>

                {/* Amount Input */}
                <div>
                  <label className="text-sm text-gray-400">
                    Amount ({tradeType === "buy" ? "SUPRA" : "ZIGGLY"})
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder={`0.00 ${tradeType === "buy" ? "SUPRA" : "ZIG"}`}
                      disabled={isLoading}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <button
                      onClick={() => setTradeAmount(getBalance(tradeType === "buy" ? "SUPRA" : "PREZIGGLY").toString())}
                      disabled={isDisabled}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-500 text-gray-900 px-2 py-1 rounded-md text-xs font-semibold hover:bg-cyan-600 transition-all ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Minimum Expected (Read-Only) */}
                <div>
                  <label className="text-sm text-gray-400">
                    Min {tradeType === "buy" ? "ZIGGLY" : "SUPRA"}
                  </label>
                  <input
                    type="number"
                    value={minExpected}
                    readOnly
                    placeholder={`0.00 ${tradeType === "buy" ? "ZIG" : "SUPRA"}`}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 cursor-not-allowed opacity-75"
                  />
                </div>

                {/* Balance Info */}
                <p className="text-sm text-gray-400 text-center">
                  Bal: {getBalance("SUPRA").toFixed(2)} SUPRA | {getBalance("PREZIGGLY").toLocaleString()} ZIG
                </p>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 10, 25, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTradeAmount(amount.toString())}
                      disabled={isDisabled}
                      className={`py-2 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 transition-all transform hover:scale-105 ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Trade Button */}
                <button
                  onClick={() => handleTrade(tradeType)}
                  disabled={isLoading || isDisabled}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                    isLoading || isDisabled
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : tradeType === "buy"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {isLoading ? "Processing..." : tradeType === "buy" ? "Buy ZIGGLY" : "Sell ZIGGLY"}
                </button>

                {/* Feedback */}
                {tradeError && <p className="text-red-400 text-sm text-center">{tradeError}</p>}
                {txHash && (
                  <p className="text-green-400 text-sm text-center">
                    Success! Tx:{" "}
                    <a
                      href={`https://suprascan.io/tx/${txHash}`}
                      target="_blank"
                      className="underline text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {txHash.slice(0, 6)}...{txHash.slice(-6)}
                    </a>
                  </p>
                )}
                <p className="text-sm text-gray-400 text-center">
                  Your ZIG: <span className="text-white">{getBalance("PREZIGGLY").toLocaleString()}</span>
                </p>
                {isDisabled && (
                  <p className="text-center text-xl font-semibold text-cyan-400 mt-4 bg-gray-700 py-2 rounded-lg shadow-md animate-pulse">
                    Tool Locked! Still in development - stay tuned for the full release!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 bg-gray-950">
        <p>Ziggly Trading | Supra Chain | © 2025 SupraTrade</p>
      </footer>
    </div>
  );
}