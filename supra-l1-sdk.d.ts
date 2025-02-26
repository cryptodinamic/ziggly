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
      rawTransaction: string; // Assuming this is a hex-encoded string based on your hook
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
  
    // Define the payload type for createRawTransactionData
    type TransactionPayloadTuple = [
      string, // senderAddress
      number, // sequenceNumber
      string, // functionFullName
      string, // gasLimit
      string, // gasPrice
      string[], // type_arguments
      [Uint8Array], // arguments
      { txExpiryTime: number } // options
    ];
  
    export class SupraClient {
      constructor(config: { rpcUrl: string; network?: string });
      static init(url: string): Promise<SupraClient>;
  
      getAccountSupraCoinBalance(account: HexString): Promise<bigint>;
      getResourceData(account: HexString, resourceType: string): Promise<CoinStoreData>;
      getCoinTransactionsDetail?(
        account: HexString,
        paginationArgs?: { start?: number; limit?: number }
      ): Promise<AccountCoinTransactionsDetail>;
      getChainId(): Promise<number>;
      getGasPrice(): Promise<bigint>;
      getAccountSequenceNumber(account: HexString): Promise<bigint>;
  
      // Add the missing createRawTransactionData method
      createRawTransactionData(payload: TransactionPayloadTuple): Promise<RawTransactionData>;
  
      // Adjusted sendTransaction to match your hook's usage
      sendTransaction(tx: { data: { rawTransaction: string } }): Promise<TransactionResponse>;
  
      sendTxUsingSerializedRawTransaction(
        senderAccount: SupraAccount,
        serializedRawTransaction: Uint8Array
      ): Promise<TransactionResponse>;
  
      static createSignedTransaction(
        senderAccount: SupraAccount,
        rawTxn: RawTransaction
      ): string; // Keeping as string to match your txHash usage
    }
  }