// src/data/tokenList.ts
export interface TokenInfo {
    coinType: string; // O identificador completo do token (ex.: 0x8bcb...::PREZIGGLY::PREZIGGLY)
    decimals: number; // Número de decimais do token
  }
  
  export const tokenList: TokenInfo[] = [
    {
      coinType: "0x8bcb5e4c66a82dc794145d911c59cba5be86bfa2c38f3fd9d2d9fefb78e37495::PREZIGGLY::PREZIGGLY",
      decimals: 6, // Ajuste conforme o número correto de decimais do PREZIGGLY
    },
    // Adicione mais tokens aqui conforme necessário
    // Exemplo:
    // {
    //   coinType: "0xOutroEndereço::MODULO::NOME_TOKEN",
    //   decimals: 8,
    // },
  ];