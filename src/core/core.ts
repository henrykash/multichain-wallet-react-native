// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";
// // Import the the ethers shims (**BEFORE** ethers)

import '@ethersproject/shims';
import { ethers } from "ethers";


import {
  BalanceResponse,
  GasLimitResponse,
  GasPriceResponse,
  ImportMnemonicResponse,
  ImportPrivateKeyResponse,
  Keystore,
  NetworkDetail,
  TransactionCostSimulationResponse,
  TransactionResponse,
  WalletCreationResponse,
} from "../interfaces/interface";
import { HelpersWrapper } from "../helpers/helpers";

export class multichainWallet {
  constructor() {}

  public async createWalletEVM(
    password: string | ethers.utils.Bytes,
    path: string = "m/44'/60'/0'/0/0",
    needPrivateKey: boolean = false,
    needPublicKey: boolean = false,
    needKeystore: boolean = true,
    mnemonicPassword: string = ""
  ): Promise<WalletCreationResponse> {
    try {
      const privateSeed = ethers.utils.randomBytes(16);;
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
    mnemonic: string,
    path: string = "m/44'/60'/0'/0/0",
    password: string = ""
  ): Promise<string> {
    try {
      password = password ? password : "";
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

  public async getAddressFromMnemonic(
    mnemonic: string,
    path: string = "m/44'/60'/0'/0/0", // Using the default Ethereum derivation path
    mnemonicPassword: string = ""
  ): Promise<string> {
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

  public async exportPrivateKeyFromKeystore(
    keystore: Keystore,
    password: string
  ): Promise<string> {
    try {
      // Convert the keystore object to a JSON string as ethers expects a JSON string for decryption
      const keystoreJsonString = JSON.stringify(keystore);
      const wallet = await ethers.Wallet.fromEncryptedJson(
        keystoreJsonString,
        password
      );
      return wallet.privateKey;
    } catch (error) {
      throw new Error(
        `Failed to export private key from keystore: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async importPrivateKey(
    privateKey: string,
    password: string,
    needPrivateKey: boolean = false,
    needPublicKey: boolean = false
  ): Promise<ImportPrivateKeyResponse> {
    try {
      // Create a wallet from the private key
      const wallet = new ethers.Wallet(privateKey);

      // Optionally encrypt the wallet to a keystore format using the provided password
      const keystore = await wallet.encrypt(password);

      // Prepare the response object based on the needs
      const response: ImportPrivateKeyResponse = {};

      if (needPrivateKey) {
        response.privateKey = wallet.privateKey;
      }

      if (needPublicKey) {
        response.publicKey = wallet.publicKey;
      }

      response.keystore = keystore;
      return response;
    } catch (error) {
      // Log the error or handle it as needed
      throw new Error(
        `Failed to import private key: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async importMnemonic(
    mnemonic: string,
    password: string,
    path: string = "m/44'/60'/0'/0'/0",
    needPrivateKey: boolean = false,
    needPublicKey: boolean = false,
    needKeystore: boolean = true
  ): Promise<ImportMnemonicResponse> {
    try {
      // Create an HDNode from the mnemonic, which allows deriving keys
      const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);

      // Prepare the response object
      const response: ImportMnemonicResponse = {};

      // Optionally include the private key
      if (needPrivateKey) {
        response.privateKey = mnemonicWallet.privateKey;
      }

      // Optionally include the public key
      if (needPublicKey) {
        response.publicKey = ethers.utils.computePublicKey(
          mnemonicWallet.privateKey
        );
      }

      // Optionally include the keystore
      if (needKeystore) {
        const keystore = await mnemonicWallet.encrypt(password);
        response.keystore = keystore;
      }

      return response;
    } catch (error) {
      throw new Error(
        `Failed to import mnemonic: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //blockhain interactions functions
  public async getBalance(
    address: string,
    network_detail: NetworkDetail = { rpcUrl: "", chainId: "", ensAddress: "" }
  ): Promise<BalanceResponse> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        network_detail.rpcUrl
      ); // Assuming 'name' holds the RPC URL
      const balance = await provider.getBalance(address);

      // Convert the balance to a more readable format, if necessary
      const formattedBalance = ethers.utils.formatEther(balance);

      return { balance: formattedBalance };
    } catch (error) {
      throw new Error(
        `Failed to get balance: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getGasPrice(
    network_detail: NetworkDetail = { rpcUrl: "", chainId: "", ensAddress: "" }
  ): Promise<GasPriceResponse> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        network_detail.rpcUrl
      );
      // Fetch the current gas price
      const gasPrice = await provider.getGasPrice();
      const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, "gwei");

      return { gasPrice: gasPriceInGwei };
    } catch (error) {
      throw new Error(
        `Failed to get gas price: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getGasLimit(
    fromAddress: string,
    toAddress: string,
    amount: ethers.BigNumberish, // Accepts BigNumber, number, string, etc.
    data: string, // Encoded transaction data
    network_detail: NetworkDetail = { rpcUrl: "", chainId: "", ensAddress: "" }
  ): Promise<GasLimitResponse> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        network_detail.rpcUrl
      );
      const transaction = {
        from: fromAddress,
        to: toAddress,
        value: amount,
        data: data,
      };

      // Estimate the gas limit
      const gasLimit: ethers.BigNumber = await provider.estimateGas(
        transaction
      );

      // Convert the BigNumber gas limit to a string
      return { gasLimit: gasLimit.toString() };
    } catch (error) {
      throw new Error(
        `Failed to get gas limit: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async simulateTransactionCost(
    fromAddress: string,
    toAddress: string,
    amount: ethers.BigNumberish,
    data: string,
    networkDetail: { rpcUrl: string; chainId: string; ensAddress?: string }
  ): Promise<TransactionCostSimulationResponse> {
    try {
      const { gasLimit } = await this.getGasLimit(
        fromAddress,
        toAddress,
        amount,
        data,
        networkDetail
      );
      const { gasPrice } = await this.getGasPrice(networkDetail);

      // Calculate total cost
      // Convert gasLimit and gasPrice from string to BigNumber for accurate multiplication
      const totalCost = ethers.utils
        .parseUnits(gasPrice, "gwei")
        .mul(ethers.BigNumber.from(gasLimit));

      // Convert total cost back to a string in Ether for easy reading
      const totalCostInEther = ethers.utils.formatEther(totalCost);

      return {
        gasLimit,
        gasPrice,
        totalCost: totalCostInEther,
      };
    } catch (error) {
      throw new Error(
        `Failed to simulate transaction cost: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async sendTransaction(
    signer: string,
    toAddress: string,
    amountEther: string,
    networkRpcUrl: { rpcUrl: string; chainId: string; ensAddress?: string }
  ): Promise<TransactionResponse> {
    try {
      if (!signer || signer.length === 0) {
        throw new Error("Sender private key is required");
      }
      if (
        !toAddress ||
        toAddress.length === 0 ||
        !ethers.utils.isAddress(toAddress)
      ) {
        throw new Error("Valid toAddress is required");
      }
      if (
        !amountEther ||
        isNaN(parseFloat(amountEther)) ||
        parseFloat(amountEther) <= 0
      ) {
        throw new Error("Valid amountEther is required");
      }
      if (!networkRpcUrl) {
        throw new Error("networkRpcUrl is required");
      }

      // Create a provider connected to the  network
      const provider = new ethers.providers.JsonRpcProvider(
        networkRpcUrl.rpcUrl
      );

      // Create a wallet instance from the private key and connect it to the network
      const wallet = new ethers.Wallet(signer, provider);

      // Create the transaction object
      const tx = {
        to: toAddress,
        // Convert the amount to Wei
        value: ethers.utils.parseEther(amountEther),
        gasPrice: await provider.getGasPrice(),
      };

      // Simulate the transaction
      try {
        await provider.estimateGas({ ...tx, from: wallet.address });
      } catch (simulationError) {
        // Check if the error is an instance of Error and throw a new error with its message
        if (simulationError instanceof Error) {
          throw new Error(
            `Transaction simulation failed: ${simulationError.message}`
          );
        } else {
          // If the caught object is not an Error instance, handle it differently
          throw new Error(
            "Transaction simulation failed: An unknown error occurred"
          );
        }
      }

      // If simulation succeeds, send the actual transaction
      const transactionResponse = await wallet.sendTransaction(tx);
      await transactionResponse.wait();

      return { transactionHash: transactionResponse.hash };
    } catch (error) {
      throw new Error(
        `Failed to send transaction: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export const multichain = new multichainWallet();
