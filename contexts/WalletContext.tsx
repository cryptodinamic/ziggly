// contexts/WalletContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SupraWalletProvider {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  account: () => Promise<string[]>;
  getChainId: () => Promise<{ chainId: string }>;
  changeNetwork: (config: { chainId: string }) => Promise<void>;
  createRawTransactionData: (
    payload: [string, number, string, string, string, string[], [Uint8Array, Uint8Array], { txExpiryTime: number }]
  ) => Promise<{ rawTransaction: string }>;
  sendTransaction: (params: { data: { rawTransaction: string } }) => Promise<void>;
  sendTokenAmount: (tx: { toAddress: string; amount: number; token: string }) => Promise<string | undefined>;
  on(event: "accountChanged", callback: (data: string) => void): void;
  on(event: "networkChanged", callback: (data: string | { chainId: string }) => void): void;
  on(event: "disconnect", callback: () => void): void;
}

declare global {
  interface Window {
    starkey?: {
      supra?: SupraWalletProvider;
    };
  }
}

interface WalletContextType {
  accounts: string[];
  networkData: { chainId: string } | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchToMainnet: () => Promise<void>;
  sendRawTransaction: () => Promise<void>;
  supraProvider: SupraWalletProvider | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supraProvider, setSupraProvider] = useState<SupraWalletProvider | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [networkData, setNetworkData] = useState<{ chainId: string } | null>(null);

  useEffect(() => {
    setSupraProvider(window.starkey?.supra || null);
  }, []);

  const checkForStarkey = () => {
    const intervalId = setInterval(() => {
      if (window.starkey?.supra) {
        setSupraProvider(window.starkey.supra);
        clearInterval(intervalId);
        updateAccounts();
      }
    }, 500);
    setTimeout(() => clearInterval(intervalId), 5000);
  };

  const getNetworkData = async () => {
    if (supraProvider) {
      try {
        const data = await supraProvider.getChainId();
        console.log("getChainId result:", data);
        if (data && "chainId" in data) {
          setNetworkData(data);
        } else {
          console.error("Invalid getChainId response:", data);
          setNetworkData(null);
        }
      } catch (error) {
        console.error("Error fetching network data:", error);
        setNetworkData(null);
      }
    }
  };

  const updateAccounts = async () => {
    if (supraProvider) {
      try {
        const response_acc = await supraProvider.account();
        setAccounts(response_acc.length > 0 ? response_acc : []);
        await getNetworkData();
      } catch {
        setAccounts([]);
      }
    }
  };

  useEffect(() => {
    if (supraProvider) {
      supraProvider.on("accountChanged", (data: string) => {
        console.log("accountChanged:", data);
        setAccounts([data]);
      });
      supraProvider.on("networkChanged", (data: string | { chainId: string }) => {
        console.log("networkChanged:", data);
        if (typeof data === "string") {
          setNetworkData({ chainId: data });
        } else if (data && "chainId" in data) {
          setNetworkData(data);
        } else {
          console.error("Invalid networkChanged data:", data);
          setNetworkData(null);
        }
      });
      supraProvider.on("disconnect", resetWalletData);
    }
  }, [supraProvider]);

  useEffect(() => {
    if (accounts.length) getNetworkData();
  }, [accounts]);

  const resetWalletData = () => {
    setAccounts([]);
    setNetworkData(null);
  };

  const connectWallet = async () => {
    if (!supraProvider) return checkForStarkey();
    try {
      await supraProvider.connect();
      await supraProvider.changeNetwork({ chainId: "8" });
      updateAccounts();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    if (supraProvider) await supraProvider.disconnect();
    resetWalletData();
  };

  const switchToMainnet = async () => {
    if (supraProvider) {
      await supraProvider.changeNetwork({ chainId: "8" });
      await getNetworkData();
    }
  };

  const sendRawTransaction = async () => {
    if (!supraProvider || !accounts.length) return;
    console.log("Sending test transaction from:", accounts[0]); // Mock temporário
  };

  const value = {
    accounts,
    networkData,
    connectWallet,
    disconnectWallet,
    switchToMainnet,
    sendRawTransaction,
    supraProvider,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet deve ser usado dentro de um WalletProvider");
  }
  return context;
};