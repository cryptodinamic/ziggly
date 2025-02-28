"use client";

import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { ethers } from "ethers";

export default function TokenTransferComponent() {
  const { accounts, connectWallet, supraProvider, networkData } = useWallet();
  const { balanceData, loading, error, refetch } = useWalletBalance();
  const isConnected = accounts.length > 0;

  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const getSupraBalance = () => {
    if (balanceData && balanceData.tokens) {
      const supraToken = balanceData.tokens.find((token) => token.tokenName === "SUPRA");
      return supraToken ? supraToken.balance : 0;
    }
    return 0;
  };

  const handleConnectWallet = async () => {
    if (!connectWallet) {
      console.error("connectWallet function is not available.");
      alert("Wallet connection is not supported.");
      return;
    }
    try {
      await connectWallet();
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      alert("Failed to connect wallet.");
    }
  };

  const handleTransfer = async () => {
    if (!isConnected || !supraProvider) {
      setTransferError("Please connect your wallet first!");
      return;
    }
    if (networkData?.chainId !== "8") {
      setTransferError("Please switch to Supra Mainnet (chainId 8)!");
      return;
    }
    if (!recipientAddress || !recipientAddress.match(/^0x[a-fA-F0-9]{64}$/)) {
      setTransferError("Please enter a valid Supra address (0x + 64 hex chars).");
      return;
    }
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      setTransferError("Please enter a valid amount of SUPRA.");
      return;
    }

    const amount = parseFloat(transferAmount);
    const supraBalance = getSupraBalance();
    if (amount > supraBalance) {
      setTransferError("Insufficient SUPRA balance.");
      return;
    }

    setIsLoading(true);
    setTransferError(null);
    setTxHash(null);

    try {
      const amountUnits = ethers.parseUnits(transferAmount, 8).toString();
      const tx = {
        data: "",
        from: accounts[0],
        to: recipientAddress,
        value: amountUnits,
        chainId: networkData.chainId,
      };
      console.log("Sending transaction:", tx);
      const txResult = await supraProvider.sendTransaction(tx);
      console.log("Transaction hash:", txResult);

      setTxHash(txResult);
      alert(`Transferred ${amount} SUPRA to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}!`);
      refetch();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send transaction.";
      setTransferError(errorMessage);
      console.error("Transfer error:", err);
    } finally {
      setIsLoading(false);
      setRecipientAddress("");
      setTransferAmount("");
    }
  };

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white overflow-hidden">
      <div className="mt-20 sm:mt-24 md:mt-28">
        <header className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M0 0h20v20H0V0zm1 1h18v18H1V1z\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulse relative z-10">
            Transfer SUPRA Tokens
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-200 text-center max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto animate-fadeIn relative z-10">
            Send SUPRA to any wallet on the Supra Network!
          </p>
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
                  <p className="mt-4 text-xl text-cyan-400 animate-pulse">Loading wallet data...</p>
                </div>
              </div>
            )}

            {loading ? null : error ? (
              <div className="text-center">
                <p className="text-2xl sm:text-3xl text-red-400">{error}</p>
              </div>
            ) : isConnected ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black/80 p-6 sm:p-8 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6">Transfer Details</h3>
                  <div className="space-y-6">
                    <p className="text-base sm:text-lg text-gray-400">
                      Your Account: <span className="text-white">{accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}</span>
                    </p>
                    <p className="text-base sm:text-lg text-gray-400">
                      SUPRA Balance: <span className="text-white">{getSupraBalance().toFixed(2)} SUPRA</span>
                    </p>
                    <p className="text-base sm:text-lg text-gray-400">
                      Network: <span className="text-white">Chain ID {networkData?.chainId}</span>
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-1 bg-black/80 p-6 sm:p-8 rounded-2xl border border-pink-500/30 shadow-2xl shadow-pink-500/20">
                  <h3 className="text-2xl sm:text-3xl font-bold text-pink-400 mb-6">Send SUPRA</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-base sm:text-lg text-gray-400">Recipient Address</label>
                      <input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder="0x..."
                        disabled={isLoading}
                        className="w-full p-3 sm:p-4 mt-2 bg-black/50 border border-pink-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <label className="text-base sm:text-lg text-gray-400">Amount (SUPRA)</label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="0.00 SUPRA"
                        disabled={isLoading}
                        className="w-full p-3 sm:p-4 mt-2 bg-black/50 border border-pink-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-400"
                      />
                      <p className="mt-2 text-sm sm:text-base text-gray-400">
                        Balance: {getSupraBalance().toFixed(2)} SUPRA
                      </p>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={handleTransfer}
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all duration-300 text-lg sm:text-xl disabled:bg-gray-500 disabled:shadow-none"
                      >
                        {isLoading ? "Processing..." : "Send SUPRA"}
                      </button>
                      {transferError && (
                        <p className="text-red-400 text-sm sm:text-base">{transferError}</p>
                      )}
                      {txHash && (
                        <p className="text-green-400 text-sm sm:text-base">
                          Success! Tx:{" "}
                          <a
                            href={`https://suprascan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-cyan-400 hover:text-pink-500"
                          >
                            {txHash.slice(0, 6)}...{txHash.slice(-6)}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl sm:text-3xl text-purple-400 mb-6">Connect Wallet to Transfer SUPRA!</p>
              </div>
            )}
          </div>
        </section>

        <footer className="p-6 sm:p-8 md:p-10 text-center text-gray-400 bg-black border-t border-cyan-500/20">
          <p className="text-sm sm:text-base md:text-lg">Supra Token Transfer | Powered by Supra Chain | © 2025 SupraTrade</p>
        </footer>
      </div>
    </div>
  );
}