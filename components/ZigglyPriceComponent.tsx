// src/components/PriceIndexComponent.tsx

import { useState, useEffect } from "react";
import { SupraClient } from "supra-l1-sdk";
import { TokenData, tokenList, TokenInfo, PoolData } from "../data/tokenlist";

// Variável global para o cliente Supra (singleton)
let supraClient: SupraClient | undefined;

// Inicializa o cliente Supra
async function initializeSupraClient(): Promise<SupraClient> {
  if (!supraClient) {
    try {
      supraClient = await SupraClient.init("https://rpc-mainnet.supra.com");
    } catch (error) {
      console.error("Erro ao inicializar SupraClient:", error);
      throw new Error("Falha na inicialização do cliente Supra");
    }
  }
  return supraClient;
}

// Busca informações do token
async function getTokenInfo(coinType: string): Promise<TokenInfo> {
  const client = await initializeSupraClient();
  try {
    const tokenInfo = await client.getCoinInfo(coinType);
    console.log(`Token Info for ${coinType}:`, tokenInfo);
    return tokenInfo;
  } catch (error) {
    console.error(`Erro ao buscar token info para ${coinType}:`, error);
    return { name: "Erro", symbol: "N/A", decimals: 6 }; // Assumindo 6 decimais para PREZIGGLY, ajuste se necessário
  }
}

// Busca dados do pool com tipagem explícita e validação
async function getPoolData(preCa: string, mainCa: string): Promise<PoolData> {
  const contractAddress = "0xc2896ec7a6ad3ac8a50626db9b832a142647ff065af6b30a089f64627c0c4a2b";
  const client = await initializeSupraClient();
  const functionFullName = `${contractAddress}::pump::get_pool`;
  const typeArguments = [preCa, mainCa];

  try {
    const rawPoolData = (await client.invokeViewMethod(functionFullName, typeArguments, [])) as string[];
    console.log(`Raw Pool Data for ${preCa} and ${mainCa}:`, rawPoolData);

    if (rawPoolData.length < 6) {
      throw new Error(`Dados insuficientes retornados para ${preCa} e ${mainCa}: ${rawPoolData.length} elementos`);
    }

    const poolData: PoolData = [
      parseFloat(rawPoolData[0]), // realAptos (ou $SUPRA no pool)
      parseFloat(rawPoolData[1]), // realToken (tokens ainda disponíveis)
      parseFloat(rawPoolData[2]), // virtualAptos
      parseFloat(rawPoolData[3]), // virtualToken
      parseFloat(rawPoolData[4]), // remainToken
      rawPoolData[5] === "true",  // isCompleted (boolean)
    ];

    console.log(`Parsed Pool Data for ${preCa} and ${mainCa}:`, poolData);
    return poolData;
  } catch (error) {
    console.error(`Erro ao buscar pool data para ${preCa} e ${mainCa}:`, error);
    return [0, 0, 0, 0, 0, false] as PoolData;
  }
}

// Função para calcular tokens por 1 Supra
const calculateTokensPerSupra = (tokenInfo: TokenInfo | null, poolData: PoolData | null): number => {
  if (!poolData || !tokenInfo?.decimals) return 0;

  const [, , virtualAptos, virtualToken] = poolData;
  const aptDecimals = 8; // $SUPRA tem 8 decimais
  const tokenDecimals = tokenInfo.decimals || 6; // Usando 6 decimais para PREZIGGLY, ajuste se necessário

  if (virtualAptos === 0) return 0;

  const aptReservesDecimal = virtualAptos / 10 ** aptDecimals;
  const tokenReservesDecimal = virtualToken / 10 ** tokenDecimals;
  return tokenReservesDecimal / aptReservesDecimal;
};

// Função para calcular o progresso do bonding curve com base em dados reais usando real_aptos
const calculateBondingProgress = (poolData: PoolData | null): number => {
  if (!poolData) return 0;
  const [realAptos] = poolData;
  const targetSupra = 500000 * 10 ** 8; // Objetivo de 500,000 $SUPRA, ajustado para 8 decimais (50,000,000,000,000)
  const currentSupra = realAptos;
  const progress = (currentSupra / targetSupra) * 100;
  console.log(`Progresso para realAptos=${currentSupra}, targetSupra=${targetSupra}: ${progress}%`);
  return Math.min(progress, 100);
};

// Função para normalizar tokens ainda disponíveis (usando poolData[1])
const normalizeRemainingTokens = (remainTokens: number, decimals?: number): number =>
  remainTokens / 10 ** (decimals || 6);

// Função para normalizar $SUPRA no pool
const normalizeSupraInPool = (supra: number): number => supra / 10 ** 8;

// Componente principal otimizado, modernizado, responsivo, com margem no topo, tabela mais larga, e UI/UX aprimorado
export default function PriceIndexComponent() {
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar todos os dados dos tokens com log, usando tokenList
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await Promise.all(tokenList.map(async (token): Promise<TokenData> => {
        const [tokenInfo, poolData] = await Promise.all([
          getTokenInfo(token.preCa),
          getPoolData(token.preCa, token.mainCa),
        ]);

        console.log(`Token Data for ${token.name}:`, { name: token.name, ticker: token.ticker, tokenInfo, poolData });

        const tokensPerSupra = calculateTokensPerSupra(tokenInfo, poolData);
        const status = poolData ? (poolData[5] ? "Listed" : "In Progress") : "In Progress";
        return { ...token, tokenInfo, poolData: poolData || null, tokensPerSupra, status };
      }));

      console.log("Final Token Data:", data);
      setTokenData(data);
    } catch (e) {
      console.error("Erro ao carregar dados dos tokens:", e);
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white mt-28">
      <div className="w-full max-w-6xl mx-auto bg-black/90 rounded-xl shadow-xl shadow-cyan-500/20 border border-cyan-500/10 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-cyan-600 to-purple-600">
          <h3 className="text-3xl font-bold text-center text-white">Pump Price Index</h3>
          <p className="text-center text-sm text-gray-200">Updated on Feb 27, 2025</p>
        </div>
        {isLoading ? (
          <div className="p-4 text-center text-gray-400 animate-pulse">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-400">{error}</div>
        ) : tokenData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-cyan-400 sticky top-0">
                <tr>
                  <th className="p-4 font-semibold md:p-6">Name</th>                  
                  <th className="p-4 font-semibold md:p-6">T/S</th>
                  <th className="p-4 font-semibold md:p-6">Status</th>
                  <th className="p-4 font-semibold md:p-6">$SUPRA</th>
                  <th className="p-4 font-semibold md:p-6">Progress</th>
                </tr>
              </thead>
              <tbody>
                {tokenData.map((token, index) => {
                  const progress = token.poolData ? calculateBondingProgress(token.poolData) : 0;
                  const currentSupra = token.poolData ? normalizeSupraInPool(token.poolData[0]) : 0;
                  const remainingTokens = token.poolData
                    ? normalizeRemainingTokens(token.poolData[1], token.tokenInfo?.decimals)
                    : 0;
                  return (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors md:hover:bg-gray-700/20">
                      <td className="p-4 font-medium text-white md:p-6">{token.name}</td>                      
                      <td className="p-4 text-cyan-400 md:p-6">{token.tokensPerSupra?.toFixed(6) ?? "0.000000"}</td>
                      <td className="p-4 md:p-6">
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          token.status === "Listed" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
                        }`}>
                          {token.status || "In Progress"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 md:p-6">{currentSupra.toLocaleString()}</td>
                      <td className="p-4 md:p-6">
                        <div className="flex flex-col gap-2 md:gap-3">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-sm text-gray-300 whitespace-nowrap md:text-base">
                              {progress.toFixed(1)}%
                            </span>
                            <div className="w-24 md:w-32 bg-gray-700 rounded-full h-2 md:h-3">
                              <div
                                className="bg-green-500 h-2 md:h-3 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-200 md:text-base">
                            Available: {remainingTokens.toLocaleString()} {token.ticker} | 
                            Pool: {currentSupra.toLocaleString()} $SUPRA
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400">No tokens found.</div>
        )}
        <div className="p-4">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-cyan-500/30 transition-all disabled:bg-gray-500 disabled:shadow-none"
          >
            {isLoading ? "Updating..." : "Refresh Index"}
          </button>
        </div>
      </div>
    </div>
  );
}