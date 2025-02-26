//hooks/useWalletBalance.ts
"use client";

import { useEffect, useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { SupraClient, HexString } from "supra-l1-sdk";
import { tokenList } from "../data/tokenlist";

interface TokenBalance {
  tokenName: string;
  balance: number;
  valueUSD: number;
}

interface WalletBalance {
  tokens: TokenBalance[];
}

let supraClient: SupraClient | undefined;

export const useWalletBalance = () => {
  const { accounts, supraProvider } = useWallet();
  const [balanceData, setBalanceData] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o SupraClient no cliente
  useEffect(() => {
    const initSupraClient = async () => {
      if (!supraClient) {
        try {
          supraClient = await SupraClient.init("https://rpc-mainnet.supra.com");
          console.log("SupraClient initialized successfully:", supraClient);
        } catch (err) {
          // Tipamos como Error para acessar .message
          console.error("Failed to initialize SupraClient:", err instanceof Error ? err.message : String(err));
          setError("Failed to connect to Supra Chain");
        }
      }
    };
    initSupraClient();
  }, []);

  const fetchBalance = async () => {
    if (!supraProvider || !accounts || accounts.length === 0 || !supraClient) {
      console.log("fetchBalance aborted:", {
        supraProvider: !!supraProvider,
        accounts,
        supraClient: !!supraClient,
      });
      setBalanceData(null);
      return;
    }

    const account = accounts[0];
    if (typeof account !== "string" || !account) {
      console.error("Invalid account:", account);
      setError("Invalid wallet address");
      setBalanceData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching balances for address:", account);
      const address = new HexString(account);
      const tokenBalances: TokenBalance[] = [];

      // 1. Saldo nativo de SUPRA
      console.log("Fetching SUPRA balance...");
      try {
        const supraBalanceRaw = await supraClient.getAccountSupraCoinBalance(address);
        console.log("Raw SUPRA balance:", supraBalanceRaw.toString());
        const supraBalance = Number(supraBalanceRaw) / 1e8;
        console.log("Formatted SUPRA balance:", supraBalance);
        if (supraBalance > 0) {
          tokenBalances.push({
            tokenName: "SUPRA",
            balance: supraBalance,
            valueUSD: supraBalance * 0.01,
          });
          console.log("SUPRA added to token balances:", tokenBalances[tokenBalances.length - 1]);
        } else {
          console.log("No SUPRA balance found for this address");
        }
      } catch (err) {
        // Tipamos como Error ou verificamos o tipo
        console.log("No SUPRA resource found (likely zero balance):", err instanceof Error ? err.message : String(err));
      }

      // 2. Consultar saldos dos tokens da lista externa
      console.log("Fetching balances for tokens in tokenList:", tokenList);
      for (const token of tokenList) {
        const { coinType, decimals } = token;
        console.log(`Fetching balance for coinType: ${coinType}`);
        try {
          const resourceType = `0x1::coin::CoinStore<${coinType}>`;
          console.log("Using resourceType:", resourceType);
          const resourceData = await supraClient.getResourceData(address, resourceType);
          console.log(`Raw resource data for ${coinType}:`, resourceData);

          const balanceRaw = resourceData?.coin?.value || "0";
          console.log(`Raw balance for ${coinType}:`, balanceRaw);
          const balance = Number(balanceRaw) / Math.pow(10, decimals);
          console.log(`Formatted balance for ${coinType}:`, balance);
          if (balance > 0) {
            const tokenName = coinType.split("::").pop() || "Unknown";
            tokenBalances.push({
              tokenName,
              balance,
              valueUSD: balance * 0.00028,
            });
            console.log(`${tokenName} added to token balances:`, tokenBalances[tokenBalances.length - 1]);
          } else {
            console.log(`No balance found for ${coinType}`);
          }
        } catch (err) {
          // Tipamos como Error ou verificamos o tipo
          console.log(`No resource found for ${coinType} (likely zero balance):`, err instanceof Error ? err.message : String(err));
        }
      }

      console.log("All tokens found for this address:", tokenBalances);
      setBalanceData({ tokens: tokenBalances });
      console.log("Balance data set:", tokenBalances);
    } catch (err) {
      // Tipamos como Error para acessar .message
      console.error("Unexpected error fetching wallet balances:", err instanceof Error ? err.message : String(err));
      setError("Failed to load token balances from Supra Chain");
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supraClient) {
      fetchBalance();
    }
  }, [accounts, supraProvider, supraClient]);

  return { balanceData, loading, error, refetch: fetchBalance };
};