declare module "supra-l1-sdk" {
  export class HexString {
    constructor(hex: string);
    toUint8Array(): Uint8Array;
  }

  export const BCS: {
    bcsSerializeUint64(value: number): Uint8Array;
  };

  interface TransactionDetail {
    hash?: string;
    sender?: string;
    coinType?: string;
    timestamp?: number;
    block_height?: number;
    status?: string;
  }

  

  interface AccountTransactionsDetail {
    transactions: TransactionDetail[];
  }

  interface AccountCoinTransactionsDetail {
    transactions: TransactionDetail[];
  }

  interface CoinInfo {
    name?: string;
    symbol?: string;
    decimals?: number;
  }

  interface CoinStoreData {
    coin: {
      value: string;
    };
    frozen?: boolean;
  }

  interface TransactionPayload {
    type: "entry_function_payload";
    function: string;
    type_arguments: string[];
    arguments: string[];
    value?: string;
  }

  interface TransactionResponse {
    hash: string;
  }

  interface RawTransactionData {
    rawTransaction: string;
  }

  class SupraAccount {
    constructor(privateKey?: Uint8Array);
  }

  class RawTransaction {
    constructor(
      sender: string,
      sequenceNumber: bigint,
      payload: TransactionPayload,
      maxGasAmount: bigint,
      gasUnitPrice: bigint,
      expirationTimestampSecs: bigint,
      chainId: number
    );
  }

  type TransactionPayloadTuple = [
    string,
    number,
    string,
    string,
    string,
    string[],
    [Uint8Array],
    { txExpiryTime: number }
  ];

  // Interface do provedor de carteira (alinhada com WalletContext)
  export interface SupraWalletProvider {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    account: () => Promise<string[]>;
    getChainId: () => Promise<{ chainId: string }>;
    changeNetwork: (config: { chainId: string }) => Promise<void>;
    createRawTransactionData: (
      payload: [string, number, string, string, string, string[], [Uint8Array, Uint8Array], { txExpiryTime: number }]
    ) => Promise<{ rawTransaction: string } | string>;
    sendTransaction: (params: { data: { rawTransaction: string } }) => Promise<void>;
    sendTokenAmount: (tx: { toAddress: string; amount: number; token: string }) => Promise<string | undefined>;
    balance: () => Promise<{ formattedBalance: string; displayUnit: string }>;
    on(event: "accountChanged", callback: (data: string) => void): void;
    on(event: "networkChanged", callback: (data: string | { chainId: string }) => void): void;
    on(event: "disconnect", callback: () => void): void;
  }

  export class SupraClient {
    constructor(config: { rpcUrl: string; network?: string });
    static init(url: string): Promise<SupraClient>;

    getAccountSupraCoinBalance(account: HexString): Promise<bigint>;
    getResourceData(account: HexString, resourceType: string): Promise<CoinStoreData>;
    getCoinTransactionsDetail(
      account: HexString,
      paginationArgs?: { start?: number; limit?: number }
    ): Promise<AccountCoinTransactionsDetail>;
    getAccountTransactionsDetail(
      account: HexString,
      paginationArgs?: { start?: number; limit?: number }
    ): Promise<AccountTransactionsDetail>;
    getChainId(): Promise<number>;
    getGasPrice(): Promise<bigint>;
    getAccountSequenceNumber(account: HexString): Promise<bigint>;

    // Sobrecarga atualizada para get_config
    invokeViewMethod(
      functionFullName: `${string}::pump::get_config`,
      typeArguments: string[],
      functionArguments: string[]
    ): Promise<[string, number, string, string, string, number, string, string, number]>;

    // Sobrecarga para get_pool
    invokeViewMethod(
      functionFullName: `${string}::pump::get_pool`,
      typeArguments: string[],
      functionArguments: string[]
    ): Promise<[string, string, string, string, string, boolean]>;

    // Nova sobrecarga para get_emergency_status
    invokeViewMethod(
      functionFullName: `${string}::emergency::get_emergency_status`,
      typeArguments: string[],
      functionArguments: string[]
    ): Promise<[boolean]>;

    createRawTransactionData(payload: TransactionPayloadTuple): Promise<RawTransactionData>;
    sendTransaction(tx: { data: { rawTransaction: string } }): Promise<TransactionResponse>;
    sendTxUsingSerializedRawTransaction(
      senderAccount: SupraAccount,
      serializedRawTransaction: Uint8Array
    ): Promise<TransactionResponse>;
    static createSignedTransaction(senderAccount: SupraAccount, rawTxn: RawTransaction): string;

    getCoinInfo(coinType: string): Promise<CoinInfo>;
    
  }
}