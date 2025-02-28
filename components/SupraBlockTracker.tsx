"use client";

import { useState, useEffect } from "react";
import { SupraClient, HexString } from "supra-l1-sdk"; // Import da Supra-L1-SDK

export default function SupraBlockTracker() {
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestBlock() {
      try {
        // Inicializa o SupraClient com o endpoint da Mainnet da Supra
        const supraClient = await SupraClient.init("https://rpc-mainnet.supra.com");

        // Usa o endereço padrão 0x1 para buscar transações da conta
        const accountAddress = new HexString("0x1");

        // Obtém as transações mais recentes da conta
        const transactions = await supraClient.getAccountTransactionsDetail(
          accountAddress,
          { start: 0, limit: 1 } // Busca apenas a transação mais recente
        );

        if (transactions && transactions.transactions.length > 0) {
          // Assume que a transação mais recente está no último bloco
          const latestTransaction = transactions.transactions[0]; // Primeira transação é a mais recente

          // Usa block_height, se disponível, ou timestamp como proxy para o bloco mais recente
          if (latestTransaction.block_height) {
            setLatestBlock(latestTransaction.block_height); // Usa o número do bloco diretamente, se disponível
          } else if (latestTransaction.timestamp) {
            // Se block_height não estiver disponível, usa o timestamp como proxy
            setLatestBlock(Math.floor(latestTransaction.timestamp / 1000)); // Converte para segundos se for em milissegundos
          } else {
            setLatestBlock(0); // Nenhum campo disponível, usa 0 como fallback
          }
        } else {
          setLatestBlock(0); // Nenhum bloco encontrado
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar o último bloco");
      } finally {
        setLoading(false);
      }
    }

    fetchLatestBlock();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Carregando último bloco...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center">Erro: {error}</div>;
  }

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">Último Bloco na Supra Mainnet</h3>
      <p className="text-white">Último bloco estimado (baseado em transações): {latestBlock || "Não disponível"}</p>
    </div>
  );
}