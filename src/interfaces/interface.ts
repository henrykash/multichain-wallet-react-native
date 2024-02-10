import { ethers } from "ethers";

export interface WalletCreationResponse {
  mnemonic: string[];
  shuffleMnemonic: string[];
  address: string;
  publicKey?: string;
  privateKey?: string;
  keystore?: Keystore; 
}

export interface Keystore {
  address: string;
  id: string;
  version: number;
  crypto: {
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
  keystore?: string;
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
  gasPrice: string;
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
