// hooks/useWallet.ts
"use client";

import { useEffect, useState } from "react";

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

export const useWallet = () => {
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
    if (!supraProvider) {
      console.log("SupraProvider não disponível para getNetworkData.");
      return null;
    }
    try {
      const data = await supraProvider.getChainId();
      console.log("Resultado de getChainId:", data);
      if (data && "chainId" in data) {
        setNetworkData(data);
        return data.chainId;
      } else {
        console.error("Resposta inválida do getChainId:", data);
        setNetworkData(null);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar dados da rede:", error);
      setNetworkData(null);
      return null;
    }
  };

  const updateAccounts = async () => {
    if (supraProvider) {
      try {
        const response_acc = await supraProvider.account();
        setAccounts(response_acc.length > 0 ? response_acc : []);
        await getNetworkData();
      } catch (error) {
        console.error("Erro ao atualizar contas:", error);
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
          console.error("Dados inválidos do networkChanged:", data);
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
    console.log("Dados da carteira resetados.");
  };

  const connectWallet = async () => {
    if (!supraProvider) {
      console.log("SupraProvider não encontrado, verificando starkey...");
      return checkForStarkey();
    }

    try {
      console.log("Tentando conectar a carteira...");
      await supraProvider.connect();
      console.log("Carteira conectada com sucesso.");

      const currentChainId = await getNetworkData();
      console.log("Chain ID atual após conexão:", currentChainId);

      if (currentChainId === null) {
        console.error("Não foi possível determinar o chain ID. Desconectando...");
        await supraProvider.disconnect();
        resetWalletData();
        return;
      }

      if (currentChainId === "8") {
        console.log("Já está na mainnet, nenhuma mudança necessária.");
      } else if (currentChainId === "6") {
        console.log("Detectada testnet, solicitando mudança para mainnet...");
        try {
          await supraProvider.changeNetwork({ chainId: "8" });
          console.log("Mudou para mainnet com sucesso.");
        } catch (changeError) {
          console.error("Erro ao mudar para mainnet (usuário negou ou falha):", changeError);
          await supraProvider.disconnect();
          resetWalletData();
          return;
        }
      } else {
        console.warn("Chain ID não suportado:", currentChainId);
        await supraProvider.disconnect();
        resetWalletData();
        return;
      }

      await updateAccounts();
    } catch (error) {
      console.error("Erro ao conectar a carteira:", error);
      if (supraProvider) {
        await supraProvider.disconnect();
      }
      resetWalletData();
    }
  };

  const disconnectWallet = async () => {
    if (supraProvider) {
      console.log("Desconectando a carteira...");
      await supraProvider.disconnect();
    }
    resetWalletData();
  };

  const switchToMainnet = async () => {
    if (supraProvider) {
      const currentChainId = await getNetworkData();
      if (currentChainId !== "8") {
        console.log("Mudando para mainnet manualmente...");
        await supraProvider.changeNetwork({ chainId: "8" });
        await getNetworkData();
      } else {
        console.log("Já está na mainnet, nenhuma ação necessária.");
      }
    }
  };

  const sendRawTransaction = async () => {
    if (!supraProvider || !accounts.length) return;
    console.log("Enviando transação de teste a partir de:", accounts[0]);
  };

  return {
    accounts,
    networkData,
    connectWallet,
    disconnectWallet,
    switchToMainnet,
    sendRawTransaction,
  };
};