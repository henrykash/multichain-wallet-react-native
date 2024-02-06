// Import the crypto getRandomValues shim (**BEFORE** the shims)
 import "react-native-get-random-values";
// Import the the ethers shims (**BEFORE** ethers)
import '@ethersproject/shims';
// Import the ethers library
import { ethers } from "ethers";
import { WalletCreationResponse } from "../interfaces/interface";
import { HelpersWrapper } from "../helpers/helpers";

export class multichainWallet {
  constructor() {}

  public async createWallet(
    password: string | ethers.utils.Bytes,
    path: string = "m/44'/60'/0'/0/0",
    seedByte: number = 16,
    needPrivateKey: boolean = false,
    needPublicKey: boolean = false,
    needKeystore: boolean = true,
    mnemonicPassword: string = ""
  ): Promise<WalletCreationResponse> {
    try {

      const privateSeed = ethers.utils.randomBytes(seedByte);
      const mnemonic = ethers.utils.entropyToMnemonic(privateSeed);
      const node = ethers.utils.HDNode.fromMnemonic(mnemonic, mnemonicPassword);
      const hdnode = node.derivePath(path);
      const mnemonicArr = mnemonic.split(" ");

      const shuffleMnemonicArr = HelpersWrapper.shuffleArray(mnemonicArr);

      let response: WalletCreationResponse = {
        mnemonic: mnemonicArr,
        shuffleMnemonic: shuffleMnemonicArr,
        address: hdnode.address,
      };

      if (needPublicKey) {
        response.publicKey = hdnode.publicKey;
      }

      if (needPrivateKey) {
        response.privateKey = hdnode.privateKey;
      }

      if (needKeystore) {
        const wallet = new ethers.Wallet(hdnode.privateKey);
        const keystore = await wallet.encrypt(password);
        response.keystore = JSON.parse(keystore);
      }

      return response;
    } catch (error) {
      throw new Error(
        `Failed to create wallet: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async exportPrivateKeyFromMnemonic(
    mnemonic: string ,
    path: string = "m/44'/60'/0'/0/0",
    password: string = ""
  ): Promise<string> {
    try { 

        
      const node = ethers.utils.HDNode.fromMnemonic(mnemonic, password);

      const hdnode = node.derivePath(path);
      return hdnode.privateKey;
    } catch (error) {
      // Ideally, you'd handle errors more gracefully or throw a custom error
      throw new Error(
        `Failed to export private key: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public getAddressFromMnemonic(
    mnemonic: string,
    path: string = "m/44'/60'/0'/0/0", // Using the default Ethereum derivation path
    mnemonicPassword: string = ""
  ): string {
    // Ensure the mnemonic is valid and has the correct number of words
    if (!mnemonic || mnemonic.split(" ").length < 12) {
      throw new Error("Invalid mnemonic phrase");
    }

    try {
      const node = ethers.utils.HDNode.fromMnemonic(mnemonic, mnemonicPassword);
      const wallet = node.derivePath(path);
      return wallet.address;
    } catch (error) {
      throw new Error(
        `Failed to derive address from mnemonic: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export const multichain = new multichainWallet();
