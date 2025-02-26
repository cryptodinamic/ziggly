// hooks/useTokenTransactions.ts
"use client";

import { useState, useCallback } from "react";
import { useWallet } from "../contexts/WalletContext";
import axios from "axios";

export const useTokenTransactions = () => {
  const { accounts, supraProvider } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Explicitly type the state
  const [txHash, setTxHash] = useState<string | null>(null);

  const buyZiggly = useCallback(async (maxAptos: number, minCoins: number) => {
    if (!accounts || accounts.length === 0 || !supraProvider) {
      setError("Carteira não conectada");
      console.log("Erro: Carteira não conectada", { accounts, supraProvider });
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const senderAddress = accounts[0];
      const contractAddress = "0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495";
      const moduleName = "token_sale";
      const functionName = "buy_tokens";
      const tokenCoinType = "0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY";
      const functionFullName = `${contractAddress}::${moduleName}::${functionName}`;
      const gasLimit = "1000000";
      const gasPrice = "100";
      const txExpiryTime = Math.floor(Date.now() / 1000) + 3600;

      // Obter o sequenceNumber via RPC correto
      console.log("Obtendo sequenceNumber para:", senderAddress);
      let response;
      try {
        response = await axios.post("https://rpc-mainnet.supra.com", {
          jsonrpc: "2.0",
          method: "supra_getAccount",
          params: [senderAddress],
          id: 1,
        });
      } catch (rpcErr) {
        console.error("Erro ao acessar RPC:", rpcErr);
        throw new Error("Falha ao obter sequenceNumber do RPC");
      }
      console.log("Resposta do RPC:", response.data);
      const sequenceNumber = Number(response.data.result?.sequence_number || 0);
      console.log("SequenceNumber obtido:", sequenceNumber);

      // Convert amounts to the appropriate format (e.g., 1 SUPRA = 1e8 units)
      const supraAmount = Math.floor(maxAptos * 1e8).toString(); // Max SUPRA to spend
      const zigglyAmount = Math.floor(minCoins * 1e8).toString(); // Min ZIG to receive

      const payload: [string, number, string, string, string, string[], [Uint8Array, Uint8Array], { txExpiryTime: number }] = [
        senderAddress,
        sequenceNumber,
        functionFullName,
        gasLimit,
        gasPrice,
        [tokenCoinType],
        [new TextEncoder().encode(supraAmount), new TextEncoder().encode(zigglyAmount)], // Pass both amounts
        { txExpiryTime },
      ];

      console.log("Payload sendo enviado:", payload);
      let rawTxData;
      try {
        rawTxData = await supraProvider.createRawTransactionData(payload);
      } catch (internalErr) {
        console.error("Erro interno em createRawTransactionData:", internalErr);
        throw new Error("Falha ao criar dados brutos da transação");
      }
      console.log("Dados da transação bruta:", rawTxData);

      if (!rawTxData || !rawTxData.rawTransaction) {
        throw new Error("Falha ao criar dados brutos da transação - retornou null ou sem rawTransaction");
      }

      console.log("Enviando transação:", rawTxData.rawTransaction);
      await supraProvider.sendTransaction({ data: { rawTransaction: rawTxData.rawTransaction } });
      setTxHash(rawTxData.rawTransaction); // Updated to use rawTxData.rawTransaction directly
      console.log("Transação concluída com hash:", rawTxData.rawTransaction);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Erro ao comprar Ziggly:", errorMessage);
      setError(`Falha ao comprar Ziggly: ${errorMessage}`); // setError is now in scope
    } finally {
      setLoading(false);
    }
  }, [accounts, supraProvider]); // Add dependencies to useCallback

  return { buyZiggly, loading, error, txHash, setError }; // Expose setError in the return
};