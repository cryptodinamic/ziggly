import { SupraClient } from "supra-l1-sdk";

const CONTRACT_ADDRESS = "0xc2896ec7a6ad3ac8a50626db9b832a142647ff065af6b30a089f64627c0c4a2b";
const RPC_URL = "https://rpc-mainnet.supra.com";

async function fetchConfig() {
  try {
    const supraClient = new SupraClient({
      rpcUrl: RPC_URL,
    });
    console.log("Cliente inicializado com sucesso:", supraClient);

    const configResult = await supraClient.invokeViewMethod(
      `${CONTRACT_ADDRESS}::pump::get_config`,
      [],
      []
    );

    console.log("Dados recebidos:", configResult);
    return configResult;
  } catch (error) {
    console.error("Erro detalhado:", error.stack || error.message || error);
    throw error;
  }
}

fetchConfig()
  .then(() => console.log("Deu certo!"))
  .catch(() => console.log("Deu errado!"));