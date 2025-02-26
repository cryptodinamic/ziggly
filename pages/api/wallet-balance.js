// pages/api/wallet-balance.js
import { SupraClient, HexString } from "supra-l1-sdk";
import { tokenList } from "../../data/tokenlist"; // Ajuste o caminho conforme sua estrutura

let supraClient;

async function initializeSupraClient() {
  if (!supraClient) {
    supraClient = await SupraClient.init("https://rpc-mainnet.supra.com");
  }
  return supraClient;
}

export default async function handler(req, res) {
  const { account } = req.query; // Recebe o endereço da carteira via query

  if (!account || typeof account !== "string") {
    return res.status(400).json({ error: "Invalid or missing wallet address" });
  }

  try {
    const client = await initializeSupraClient();
    const address = new HexString(account);
    const tokenBalances = [];

    // 1. Saldo nativo de SUPRA
    const supraBalanceRaw = await client.getAccountSupraCoinBalance(address);
    const supraBalance = Number(supraBalanceRaw) / 1e8;
    if (supraBalance > 0) {
      tokenBalances.push({
        tokenName: "SUPRA",
        balance: supraBalance,
        valueUSD: supraBalance * 0.01, // Ajuste o preço conforme necessário
      });
    }

    // 2. Saldos dos tokens da tokenList
    for (const token of tokenList) {
      const { coinType, decimals } = token;
      try {
        const resourceType = `0x1::coin::CoinStore<${coinType}>`;
        const resourceData = await client.getResourceData(address, resourceType);
        const balanceRaw = resourceData?.coin?.value || "0";
        const balance = Number(balanceRaw) / Math.pow(10, decimals);
        if (balance > 0) {
          const tokenName = coinType.split("::").pop() || "Unknown";
          tokenBalances.push({
            tokenName,
            balance,
            valueUSD: balance * 0.01, // Ajuste o preço conforme necessário
          });
        }
      } catch (err) {
        console.error(`Error fetching balance for ${coinType}:`, err);
      }
    }

    res.status(200).json({ tokens: tokenBalances });
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    res.status(500).json({ error: `Failed to fetch wallet balance: ${error.message}` });
  }
}