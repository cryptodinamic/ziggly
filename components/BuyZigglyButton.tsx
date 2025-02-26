// components/BuyZigglyButton.tsx
"use client";

import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useTokenTransactions } from "../hooks/useTokenTransactions";

export const BuyZigglyButton: React.FC = () => {
  const { connectWallet, accounts, networkData } = useWallet();
  const { buyZiggly, loading, error, txHash } = useTokenTransactions();
  const [amount, setAmount] = useState<string>("1");

  const handleConnect = async () => {
    console.log("Conectando carteira...");
    await connectWallet();
    console.log("Carteira conectada:", accounts);
  };

  const handleBuy = async () => {
    if (!accounts.length) {
      alert("Por favor, conecte sua carteira primeiro!");
      return;
    }
    if (!networkData || networkData.chainId !== "8") {
      alert("Por favor, mude para a mainnet da Supra (chainId 8)!");
      return;
    }
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert("Insira uma quantidade válida de SUPRA!");
      return;
    }
    console.log("Iniciando compra de", value, "SUPRA...");
    await buyZiggly(value);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-xl mb-4">Comprar Ziggly com SUPRA</h2>
      {!accounts.length ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-500"
        >
          Conectar Carteira Starkey Supra
        </button>
      ) : (
        <>
          <p className="text-gray-300 mb-2">Carteira conectada: {accounts[0]}</p>
          <p className="text-gray-300 mb-4">Rede: {networkData?.chainId || "Desconhecida"}</p>
          <div className="mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              disabled={loading}
              placeholder="Quantidade em SUPRA"
              className="w-full p-2 rounded text-black"
            />
          </div>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-500"
          >
            {loading ? "Processando..." : "Comprar Ziggly"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {txHash && (
            <p className="text-green-300 mt-2">
              Sucesso! Veja a transação:{" "}
              <a
                href={`https://suprascan.io/tx/${txHash}/f?tab=advanced%20information`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {txHash}
              </a>
            </p>
          )}
        </>
      )}
    </div>
  );
};