"use client";

import React from "react";
import { useWallet } from "../contexts/WalletContext"; // Adjust path to match your structure

const WalletConnector = () => {
  const { accounts, networkData, connectWallet, disconnectWallet, switchToMainnet } = useWallet();

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center space-x-4">
      {accounts.length > 0 ? (
        <>
          <span className="text-gray-300 font-mono">{formatAddress(accounts[0])}</span>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
          >
            Disconnect
          </button>
          {networkData?.chainId !== "8" && (
            <button
              onClick={switchToMainnet}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
            >
              Switch to Mainnet
            </button>
          )}
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnector;