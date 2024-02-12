# Welcome
- A Web3 wallet library with tools to fasten your react-native application development.
  
This wallet module does not expose the private key,
and only advocates storing the keystore or the mnemonic with the
password authentication locally, and does not activate the wallet except for write operations.

## Installation
- `npm i multichain-wallet-react-native`
- `npm install react-native-get-random-values --save`
-  `npm install react-native --save`

## Features
- Create EVM-compatible wallets (Ethereum, etc.)
- Retrieve wallet addresses from mnemonics
- Export and Import private keys from mnemonics
- exportPrivateKeyFromKeystore
- importMnemonic
- getBalance
- getGasPrice
- getGasLimit
- simulateTransactionCost
- sendTransaction

## Usage
- Below are some examples of how to use the library
Import 
 ```bash
    import { multichainWallet } from 'multichain-wallet-react-native'
    const multichain = new multichaiWallet()
 ```

## Create Wallet
```bash
async function generateMnemonic() {
  const passCode = "helloworld"
  const mnemonic = await multichain.createWalletEVM(passCode);
  console.log(`Mnemonic: ${mnemonic}`);
}
// Note: Mnemonics with less than 12 words have low entropy and may be guessed by an attacker.
generateMnemonic();
```

- Response
```bash 
  {
  "keystore": ..., 
  "mnemonic": ...,
  "shuffleMnemonic": ...,
  "privateKey" : ...,//option
  "publicKey" : ...,//option  
}
```

## Get EVM Wallet Address from Mnemonic

```bash
async function getAddress() {
  const mnemonic = [
        'cream',
        'frozen',
        'weather',
        'group',
        'track',
        'parrot',
        'stove',
        'just',
        'license',
        'collect',
        'mandate',
        'arrest',
      ];
  const mnemonicPhrase = mnemonic.join('')
  const address = await multichain.getAddressFromMnemonic(mnemonicPhrase);
  console.log(`Address: ${address}`);
}

getAddress();
```
- Reponse
```bash
{
  address: '0xfBE11AC0258cc8288cA24E818691Eb062f7042E9',
}

```

## Export PrivateKey From Mnemonic
```bash
 async function getPrivateKey() {
   const mnemonic = [
        'cream',
        'frozen',
        'weather',
        'group',
        'track',
        'parrot',
        'stove',
        'just',
        'license',
        'collect',
        'mandate',
        'arrest',
      ];
  const mnemonicPhrase = mnemonic.join(' ')
  const privateKey = await multichain.exportPrivateKeyFromMnemonic(mnemonicPhrase);
  console.log(`Private Key: ${privateKey}`);
}

getPrivateKey();
```
- Reponse
```bash
{
  privateKey: '0xfdf745f45d1942feea79b4c0a3fc1ca67da366899f7e6cebaa06496806ca8127',
}
```

## Export PrivateKey From Keystore
```bash
 async function getPrivateKey() {
  const passCode = "helloworld"
  cont keyStore = { } //the keystore object returned when creating a wallet
  const privateKey = await multichain.exportPrivateKeyFromKeystore(keyStore, passCode);
  console.log(`Private Key: ${privateKey}`);
}

getPrivateKey();
```
- Reponse
```bash
{
  privateKey: '0xfdf745f45d1942feea79b4c0a3fc1ca67da366899f7e6cebaa06496806ca8127',
}
```
## Import wallet from PrivateKey
```bash
 async function importWalletFromKey() {
  const passCode = "helloworld"
  cont privateKey = "0xfdf745f45d1942feea79b4c0a3fc1ca67da366899f7e6cebaa06496806ca8127" //the privateKey to which you want to import the wallet
  const keyStore = await multichain.importPrivateKey(privateKey, passCode);
  console.log(`Kestore Key: ${keyStore}`);
}
importWalletFromKey();
```
- Reponse
 Returns a keyStore object where, you can access wallet address, privateKey etc
```bash
{
  keyStore: { }
}
```
## Import Wallet from Mnemonic
```bash
 async function importWalletMnemonic() {
  const passCode = "helloworld"
  const mnemonic = [
        'cream',
        'frozen',
        'weather',
        'group',
        'track',
        'parrot',
        'stove',
        'just',
        'license',
        'collect',
        'mandate',
        'arrest',
      ];  //the mnemonic to which you want to import the wallet
  const mnemonicPhrase = mnemonic.join(' ')
  const keyStore = await multichain.importPrivateKey(mnemonicPhrase, passCode);
  console.log(`Kestore Key: ${keyStore}`);
}
importWalletMnemonic();
```
- Reponse
 Returns a keyStore object where, you can access wallet address, privateKey etc
```bash
{
  keyStore: { }
}
```

## getBalance
```bash
const getWalletBalance = async()=>{
    const address = '0x123...'; // Replace with a valid Ethereum address
    const networkDetail = { rpcUrl: 'https://mainnet.infura.io/v3/your_project_id' }; // Replace with your actual RPC URL
   
    const result = await multichain.getBalance(address, networkDetail);
    return result.balance
}
getWalletBalance()
```
- Reponse
 Returns the native wallet balance formatted 
```bash
{
  balance: "0.0004"
}
```

## getGasPrice
```bash
const getGasPrice = async()=>{
    const networkDetail = { rpcUrl: 'https://mainnet.infura.io/v3/your_project_id' }; // Replace with your actual RPC URL
   
    const result = await multichain.getGasPrice(networkDetail);
    return result.gasPrice
}
getGasPrice()
```
- Reponse
 Returns the network gasPrice in Gwei formatted 
```bash
{
  gasPrice: "10"
}
```

## getGasLimit
```bash
const getWalletGasLimit = async()=>{
    const networkDetail = { rpcUrl: 'https://mainnet.infura.io/v3/your_project_id' }; // Replace with your actual RPC URL
    const fromAddress = '0x...'; // Replace with your fromAddress
    const toAddress = '0x...'; // Replace with your toAddress
    const amount = ethers.utils.parseEther('1'); // 1 ether, for example
    const data = '0x...'; // Replace with your transaction data
   
    const result = await multichain.getGasLimit(fromAddress, toAddress, amount, data, networkDetail);
    return result.gasLimit
}
getWalletGasLimit()
```
- Reponse
 Returns the gasLimit of wallet address formatted 
```bash
{
  gasLimit: "210000"
}
```
## simulateTransactionCost
```bash
const  simulateTransactionCost = async()=>{
    const networkDetail = { rpcUrl: 'https://mainnet.infura.io/v3/your_project_id' }; // Replace with your actual RPC URL
    const fromAddress = '0x...'; // Replace with your fromAddress
    const toAddress = '0x...'; // Replace with your toAddress
    const amount = ethers.utils.parseEther('1'); // 1 ether, for example
    const data = '0x...'; // Replace with your transaction data
   
    const result = await multichain.simulateTransactionCost(fromAddress, toAddress, amount, data, networkDetail);
    return result.totalCost
}
simulateTransactionCost()
```

- Reponse
 Returns the totalCost of the transaction after simulation formatted.
```bash
{
  totalCost: "0.002"
}
```
## sendTransaction
```bash
const  sendTransaction = async()=>{
    const networkDetail = { rpcUrl: 'https://mainnet.infura.io/v3/your_project_id' }; // Replace with your actual RPC URL
    const signerPrivateKey = '0xPRIVATE_KEY'; // Use a test or mock private key
    const toAddress = '0xRECEIVER_ADDRESS';
    const amountEther = '0.001'; // 0.001 ether to send
    const result = await multichain.sendTransaction(fromAddress, toAddress, amount, data, networkDetail);
    return result.totalCost
}
sendTransaction()
```

- Reponse
 Returns the transaction hash of the transaction after the transaction broadcasted.
```bash
{
  transactionHash: "0x03854356645396097a8e528e3c27f97107ecc98f2ac9296427d8e3782b91a2c5"
}
```

## Contributing
- Contributions are welcome! Please feel free to submit a pull request or open an issue.
