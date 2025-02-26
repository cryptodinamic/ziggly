// pages/api/getSequenceNumber.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { SupraClient, HexString } from "supra-l1-sdk";

let supraClient: SupraClient | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { address } = req.body;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Endereço inválido" });
  }

  try {
    if (!supraClient) {
      supraClient = await SupraClient.init("https://rpc-mainnet.supra.com");
      console.log("SupraClient inicializado no servidor");
    }

    const sequenceNumber = Number(await supraClient.getAccountSequenceNumber(new HexString(address)));
    res.status(200).json({ sequenceNumber });
  } catch (error) {
    console.error("Erro ao obter sequence number:", error);
    res.status(500).json({ error: "Erro ao obter sequence number" });
  }
}