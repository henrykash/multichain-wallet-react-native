// Import the crypto getRandomValues shim (**BEFORE** the shims)
// import "react-native-get-random-values";
// // Import the the ethers shims (**BEFORE** ethers)

// import '@ethersproject/shims';
import {
  SigningKey,
  BytesLike,
  HDNodeWallet,
  JsonRpcProvider,
  Wallet,
  ethers,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
  randomBytes,
  Mnemonic,
  Contract,
} from "ethers";

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

export class multichainWallet {
  constructor() {}

  public async createWalletEVM(
    password: string,
    derivationPath: string = "m/44'/60'/0'/0/0"
  ): Promise<WalletCreationResponse> {
    // Generate a new mnemonic
    const mnemonic = ethers.Wallet.createRandom().mnemonic!.phrase;

    const mnemonicInstance = Mnemonic.fromPhrase(mnemonic);
    // Use the mnemonic and derivation path to create a wallet
    const wallet = HDNodeWallet.fromMnemonic(mnemonicInstance, derivationPath);

    // Extract necessary components
    const { address, privateKey } = wallet;

    const mnemonicArray = mnemonic.split(" ");

    // Encrypt the private key to get a keystore JSON object
    const keystoreJson = await wallet.encrypt(password);

    const keystore: Keystore = JSON.parse(keystoreJson);

    return {
      address,
      privateKey,
      mnemonic: mnemonicArray,
      keystore,
    };
  }

  public async exportPrivateKeyFromMnemonic(
    mnemonic: string,
    path: string = "m/44'/60'/0'/0/0"
  ): Promise<string> {
    if (!mnemonic || mnemonic.split(" ").length < 12) {
      throw new Error("Invalid mnemonic phrase");
    }

    try {
      // Ensure mnemonic is a single space-separated string
      const mnemonicExport = Array.isArray(mnemonic)
        ? mnemonic.join(" ")
        : mnemonic;
      const mnemonicPhrase = Mnemonic.fromPhrase(mnemonicExport);

      const wallet = HDNodeWallet.fromMnemonic(mnemonicPhrase, path);
      // Return the private key
      return wallet.privateKey;
    } catch (error) {
      throw new Error(
        `Failed to export private key: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getAddressFromMnemonic(
    mnemonic: string | any,
    path: string = "m/44'/60'/0'/0/0" // Using the default Ethereum derivation path
  ): Promise<string> {
    // Ensure the mnemonic is valid and has the correct number of words
    if (!mnemonic || mnemonic.split(" ").length < 12) {
      throw new Error("Invalid mnemonic phrase");
    }

    try {
      const mnemonicExport = Array.isArray(mnemonic)
        ? mnemonic.join(" ")
        : mnemonic;
      const mnemonicPhrase = Mnemonic.fromPhrase(mnemonicExport);
      const wallet = HDNodeWallet.fromMnemonic(mnemonicPhrase, path);
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
      const wallet = await Wallet.fromEncryptedJson(
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
      const wallet: any = new Wallet(privateKey);

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
  ): Promise<ImportMnemonicResponse> {
    try {
       
      const mnemonicInstance = Mnemonic.fromPhrase(mnemonic);
    // Use the mnemonic and derivation path to create a wallet
    const wallet = HDNodeWallet.fromMnemonic(mnemonicInstance, path);

    const { address, privateKey } = wallet;

    // Encrypt the private key to get a keystore JSON object
    const keystoreJson = await wallet.encrypt(password);
    const keystore: Keystore = JSON.parse(keystoreJson);

    return {
      publicKey:address,
      privateKey,
      keystore,
    };
    } catch (error) {
      throw new Error(
        `Failed to import mnemonic: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async verifyMnemonic(mnemonic: string): Promise<boolean> {
    return Mnemonic.isValidMnemonic(mnemonic);
}


  //blockhain interactions functions
  public async getBalanceNative(
    walletAddress: string,
    network_detail: NetworkDetail = { rpcUrl: "", chainId: "", ensAddress: "" }
  ): Promise<BalanceResponse> {
    try {
      const provider = new JsonRpcProvider(network_detail.rpcUrl);
      // Fetch Native Coin Balance
      const balance = await provider.getBalance(walletAddress);

      //Convert the balance to a more readable format
      const formattedBalance = formatEther(balance);

      return { balance: formattedBalance };
    } catch (error) {
      throw new Error(
        `Failed to get balance: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getBalanceERC20(
    walletAddress: string,
    network_detail: NetworkDetail = { rpcUrl: "", chainId: "", ensAddress: "" },
    tokenAddress: string
  ): Promise<BalanceResponse> {
    try {
      const tokenABI = [
        "function balanceOf(address owner) view returns (uint256)",
      ];

      const provider = new JsonRpcProvider(network_detail.rpcUrl);
      const tokenContract = new Contract(tokenAddress, tokenABI, provider);

      // Fetch ERC20 Token Balance
      const erc20Bal = await tokenContract.balanceOf(walletAddress);

      // Convert the balance to a more readable format
      const formattedBalance = formatUnits(erc20Bal.toString());
      return { balance: formattedBalance };
    } catch (error) {
      console.error("Error querying ERC20 balance:", error);
      throw new Error(
        `Failed to get balance: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async getGasPrice(network_detail: {
    rpcUrl: string;
    chainId: string;
    ensAddress?: string;
  }): Promise<GasPriceResponse> {
    try {
      const provider = new JsonRpcProvider(network_detail.rpcUrl);
      // Fetch the current fee data, which includes EIP-1559 fee values
      const feeData = await provider.getFeeData();

      // Initialize response object
      let response: GasPriceResponse;

      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        // EIP-1559 network, return maxFeePerGas and maxPriorityFeePerGas
        response = {
          maxFeePerGas: formatUnits(feeData.maxFeePerGas, "gwei"),
          maxPriorityFeePerGas: formatUnits(
            feeData.maxPriorityFeePerGas,
            "gwei"
          ),
        };
      } else if (feeData.gasPrice) {
        // Legacy network, return gasPrice
        response = {
          gasPrice: formatUnits(feeData.gasPrice, "gwei"),
        };
      } else {
        // If neither is available, throw an error
        throw new Error("Unable to retrieve gas price data.");
      }

      return response;
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
    networkDetail: NetworkDetail = { rpcUrl: "", chainId: "", ensAddress: "" }
  ): Promise<GasLimitResponse> {
    // Check for valid fromAddress and toAddress
    if (!ethers.isAddress(fromAddress)) {
      throw new Error("Invalid fromAddress provided.");
    }
    if (!ethers.isAddress(toAddress)) {
      throw new Error("Invalid toAddress provided.");
    }

    // Check for valid amount
    if (amount == null || amount === "") {
      throw new Error("Amount must be provided.");
    }

    // Check for non-null data, assuming data is optional but must be a string if provided
    if (data != null && typeof data !== "string") {
      throw new Error("Data must be a string.");
    }

    // Check for valid networkDetail object with required rpcUrl
    if (
      !networkDetail ||
      !networkDetail.rpcUrl ||
      typeof networkDetail.rpcUrl !== "string"
    ) {
      throw new Error("Invalid networkDetail provided. RPC URL is required.");
    }

    try {
      const provider = new JsonRpcProvider(networkDetail.rpcUrl);
      const transaction = {
        from: fromAddress,
        to: toAddress,
        value: parseEther(amount.toString()),
        data: data,
      };

      // Estimate the gas limit
      const gasLimit = await provider.estimateGas(transaction);

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
    // Check for valid fromAddress and toAddress
    if (!ethers.isAddress(fromAddress)) {
      throw new Error("Invalid fromAddress provided.");
    }
    if (!ethers.isAddress(toAddress)) {
      throw new Error("Invalid toAddress provided.");
    }

    // Check for valid amount
    if (amount == null || amount === "") {
      throw new Error("Amount must be provided.");
    }

    // Check for non-null data, assuming data is optional but must be a string if provided
    if (data != null && typeof data !== "string") {
      throw new Error("Data must be a string.");
    }

    // Check for valid networkDetail object with required rpcUrl
    if (
      !networkDetail ||
      !networkDetail.rpcUrl ||
      typeof networkDetail.rpcUrl !== "string"
    ) {
      throw new Error("Invalid networkDetail provided. RPC URL is required.");
    }

    try {
      const provider = new JsonRpcProvider(networkDetail.rpcUrl);
      const feeData: any = await provider.getFeeData();

      // Convert amount to BigInt for calculation
      // Ensure amount is a string that represents the value in wei for direct conversion to BigInt
      const amountInWei = BigInt(parseUnits(amount.toString(), "ether"));

      // Estimate gas limit for the transaction
      const gasLimit = await provider.estimateGas({
        from: fromAddress,
        to: toAddress,
        value: amountInWei,
        data: data,
      });

      let totalCost;

      // Use BigInt for gasPrice and maxFeePerGas calculations
      const gasPrice = feeData.gasPrice
        ? BigInt(feeData.gasPrice.toString())
        : null;
      const maxFeePerGas = feeData.maxFeePerGas
        ? BigInt(feeData.maxFeePerGas.toString())
        : null;

      if (maxFeePerGas) {
        // Calculate total cost for EIP-1559 transactions
        totalCost = maxFeePerGas * gasLimit;
      } else if (gasPrice) {
        // Calculate total cost for legacy transactions
        totalCost = gasPrice * gasLimit;
      } else {
        throw new Error("Unable to retrieve gas price data.");
      }

      // Convert total cost back to a string in Ether for readability
      const totalCostInEther = formatUnits(totalCost.toString(), "ether");

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice ? gasPrice.toString() : "EIP-1559 transaction",
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
    amountEther: string, // Amount in Ether as a string
    networkRpcUrl: { rpcUrl: string; chainId: string; ensAddress?: string }
): Promise<{ transactionHash: string }> {
    try {
        if (!signer) {
            throw new Error("Sender private key is required");
        }
        if (!ethers.isAddress(toAddress)) {
            throw new Error("Valid toAddress is required");
        }
        const amountInWei =  parseUnits(amountEther, "ether");

        const provider = new JsonRpcProvider(networkRpcUrl.rpcUrl);
        const wallet = new ethers.Wallet(signer).connect(provider);

        const feeData = await provider.getFeeData();

        let tx: ethers.TransactionRequest;

        if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
            tx = {
                to: toAddress,
                value: amountInWei,
                maxFeePerGas: feeData.maxFeePerGas,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            };
        } else {
            tx = {
                to: toAddress,
                value: amountInWei,
                // Ensure gasPrice is properly handled as a BigInt or BigNumberish
                gasPrice: feeData.gasPrice ? BigInt(feeData.gasPrice) : undefined,
            };
        }

        // Simulate the transaction (optional)
        await provider.estimateGas({ ...tx, from: wallet.address });

        // Send the actual transaction
        const transactionResponse = await wallet.sendTransaction(tx);
        await transactionResponse.wait(); // Wait for the transaction to be mined

        return { transactionHash: transactionResponse.hash };
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to send transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
}
}

export const multichain = new multichainWallet();
