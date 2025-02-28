// pages/api/pump-data.js
import { SupraClient } from "supra-l1-sdk";

export default async function handler(req, res) {
  try {
    console.log("Iniciando conexão com o SupraClient...");
    const supraClient = new SupraClient("https://rpc-mainnet.supra.com");
    console.log("Conexão com SupraClient estabelecida com sucesso! URL:", supraClient.supraNodeURL);
    res.status(200).json({ message: "Conexão com SupraClient bem-sucedida" });
  } catch (error) {
    console.error("Falha ao conectar com o SupraClient:", error.message, error.stack);
    res.status(500).json({ error: "Falha ao conectar com o SupraClient" });
  }
}