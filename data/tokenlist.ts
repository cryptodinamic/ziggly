// src/data/tokenList.ts

// Interface para informações completas de um token, incluindo dados dinâmicos
export interface TokenData {
  name: string; // Nome do token (ex.: "PreZiggly")
  ticker: string; // Símbolo do token (ex.: "PREZIGGLY")
  preCa: string; // Endereço do token pré-C (ex.: "0x8bcb...::PREZIGGLY::PREZIGGLY")
  mainCa: string; // Endereço do token principal (ex.: "0x8bcb...::ZIGGLY::ZIGGLY")
  coinType: string; // Identificador completo do token (mesmo que preCa ou mainCa, dependendo do contexto)
  decimals: number; // Número de decimais do token  
  tokenInfo?: TokenInfo | null; // Informações dinâmicas do token (opcional, pode ser null)
  poolData?: PoolData | null; // Dados dinâmicos da pool (opcional, pode ser null)
  tokensPerSupra?: number; // Valor calculado dinamicamente (opcional, pode ser undefined)
  status?: string; // Status do token (opcional, "Listed" ou "In Progress")
}

// Tipagem para informações do token (usada em tokenInfo)
export interface TokenInfo {
  name?: string;
  symbol?: string;
  decimals?: number;
}

// Tipagem para dados do pool (usada em poolData)
export type PoolData = [number, number, number, number, number, boolean];

// Lista de tokens com todas as informações
export const tokenList: TokenData[] = [
  {
    name: "Ziggly",
    ticker: "ZIGGLY",
    preCa: "0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY",
    mainCa: "0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::ZIGGLY::ZIGGLY",
    coinType: "0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY",
    decimals: 6, // Número de decimais do PREZIGGLY   
    tokenInfo: null, // Inicialmente null, será preenchido dinamicamente
    poolData: null, // Inicialmente null, será preenchido dinamicamente
    tokensPerSupra: undefined, // Inicialmente undefined, será calculado dinamicamente
    status: undefined, // Inicialmente undefined, será definido dinamicamente
  },
  {
    name: "Supra Mummy",
    ticker: "Mummy",
    preCa: "0x729982d3ad6130276c6972880810b7ddabe6d7fb59b5029fa5bed5674ae75a70::PREMUMMY::PREMUMMY",
    mainCa: "0x729982d3ad6130276c6972880810b7ddabe6d7fb59b5029fa5bed5674ae75a70::MUMMY::MUMMY",
    coinType: "0x729982d3ad6130276c6972880810b7ddabe6d7fb59b5029fa5bed5674ae75a70::PREMUMMY::PREMUMMY",
    decimals: 6, // Assumindo 6 decimais para PreSprt, ajuste se necessário   
    tokenInfo: null, // Inicialmente null, será preenchido dinamicamente
    poolData: null, // Inicialmente null, será preenchido dinamicamente
    tokensPerSupra: undefined, // Inicialmente undefined, será calculado dinamicamente
    status: undefined, // Inicialmente undefined, será definido dinamicamente
  },
];