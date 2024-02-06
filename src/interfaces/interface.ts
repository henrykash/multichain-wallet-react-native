export interface Keystore {
  address: string;
  id: string;
  version: number;
  crypto: object;
  "x-ethers": object;
}

export interface WalletCreationResponse {
    mnemonic: string[];
    shuffleMnemonic: string[];
    address: string;
    publicKey?: string;
    privateKey?: string;
    keystore?: object; // Adjust the type based on the actual structure of your keystore
  }
