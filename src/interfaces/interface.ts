import { ethers } from "ethers";

export interface WalletCreationResponse {
  address: string;
  mnemonic?: string[];
  privateKey?: string;
  publicKey?: string;
  keystore?: Keystore; // This will be a JSON string
}
export interface Keystore {
  address: string;
  id: string;
  version: number;
  Crypto: { // Note the capital 'C' to match the actual keystore structure
    cipher: string;
    cipherparams: {
      iv: string;
    };
    ciphertext: string;
    kdf: string;
    kdfparams: {
      salt: string;
      n: number;
      dklen: number;
      p: number;
      r: number;
    };
    mac: string;
  };

}


export interface ImportPrivateKeyResponse {
  privateKey?: string;
  publicKey?: string;
  keystore?: string; 
}

export interface ImportMnemonicResponse {
  privateKey?: string;
  publicKey?: string;
  keystore?: Keystore;
}

export interface NetworkDetail {
  rpcUrl: string;
  chainId: string;
  ensAddress?: string;
}

export interface BalanceResponse {
  balance: string;
}

export interface GasPriceResponse {
  gasPrice?: string;
  maxFeePerGas?: string; // EIP-1559 field
  maxPriorityFeePerGas?: string; // EIP-1559 field
}


export interface GasLimitResponse {
  gasLimit: string;
}

export interface TransactionCostSimulationResponse {
  gasLimit: string;
  gasPrice: string;
  totalCost: string;
}

export interface TransactionResponse {
  transactionHash: string;
}
