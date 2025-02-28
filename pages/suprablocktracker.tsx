// pages/suprablocktracker.tsx
import { GetServerSideProps } from "next";
import { SupraClient, HexString } from "supra-l1-sdk";

interface SupraBlockTrackerProps {
  latestBlock: number | null;
  error: string | null;
}

export default function SupraBlockTrackerPage({ latestBlock, error }: SupraBlockTrackerProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 mb-8">
        Supra Blockchain Tracker
      </h1>
      {error ? (
        <div className="text-red-400 text-center">Erro: {error}</div>
      ) : (
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">Último Bloco na Supra Mainnet</h3>
          <p className="text-white">Último bloco estimado (baseado em transações): {latestBlock || "Não disponível"}</p>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SupraBlockTrackerProps> = async () => {
  let latestBlock: number | null = null;
  let error: string | null = null;

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
        latestBlock = latestTransaction.block_height; // Usa o número do bloco diretamente, se disponível
      } else if (latestTransaction.timestamp) {
        // Se block_height não estiver disponível, usa o timestamp como proxy
        latestBlock = Math.floor(latestTransaction.timestamp / 1000); // Converte para segundos se for em milissegundos
      } else {
        latestBlock = 0; // Nenhum campo disponível, usa 0 como fallback
      }
    } else {
      latestBlock = 0; // Nenhum bloco encontrado
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Erro desconhecido ao buscar o último bloco";
  }

  return {
    props: {
      latestBlock,
      error,
    },
  };
};