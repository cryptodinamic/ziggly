// hooks/useSupraUtils.tsx
"use client";

import { useState, useEffect } from "react";
import { HexString, SupraClient } from "supra-l1-sdk";

interface ExtendedSupraClient extends SupraClient {
  isAccountExists(account: HexString): Promise<boolean>;
}

interface SupraUtils {
  supraClient: ExtendedSupraClient | null;
  getBalance: (address: string) => Promise<string>;
  checkAccountExists: (address: string) => Promise<boolean>;
}

export const useSupraUtils = (): SupraUtils => {
  const [supraClient, setSupraClient] = useState<ExtendedSupraClient | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const client = new SupraClient({ rpcUrl: "https://rpc-mainnet.supra.com" }) as ExtendedSupraClient;
      setSupraClient(client);
    }
  }, []);

  const getBalance = async (address: string): Promise<string> => {
    if (!supraClient) return "0.00";
    try {
      const balance = await supraClient.getAccountSupraCoinBalance(new HexString(address));
      return (Number(balance) / 1e6).toFixed(2);
    } catch (err) {
      console.error("Erro ao obter saldo:", err);
      return "0.00";
    }
  };

  const checkAccountExists = async (address: string): Promise<boolean> => {
    if (!supraClient) return false;
    try {
      return await supraClient.isAccountExists(new HexString(address));
    } catch (err) {
      console.error("Erro ao verificar conta:", err);
      return false;
    }
  };

  return { supraClient, getBalance, checkAccountExists };
};