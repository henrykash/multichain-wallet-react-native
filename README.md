# Welcome
- A Web3 wallet library with tools to fasten your react-native application development. Uses ethers v6 library.
  
This wallet module does not expose the private key,
and only advocates storing the keystore or the mnemonic with the
password authentication locally, and does not activate the wallet except for write operations.

## Installation
- `npm i multichain-wallet-react-native@latest`
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
    const multichain = new multichainWallet()
 ```

## Create Wallet
```bash
async function generateMnemonic() {
  const passCode = "helloworld"
  const { keystore, privateKey, address, mnemonic } = await multichain.createWalletEVM(passCode);
  console.log(JSON.stringify(keystore), privateKey, address, mnemonic);
}
// Note: Mnemonics with less than 12 words have low entropy and may be guessed by an attacker.
generateMnemonic();
```

- Response
```bash 
  {"address":"1f9cc534ff25f2abe1753eb882b20130adcb2748","id":"7378bcf5-c84d-4212-91b2-e2585f169a0f","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1b12b9f04deb0878ccb7c47e01db3e3e"},"ciphertext":"480f41097b245cad8dfe8a650867d225b27b6ec5da10bd6d91d4bb3578384f26","kdf":"scrypt","kdfparams":{"salt":"a81a1802241699efd215129281534678cf50e75a88db0ab04d9a35b3836ab27f","n":131072,"dklen":32,"p":1,"r":8},"mac":"83334806b2a436746325d8508610afe3c0c3ec51b41a80dbafc7aa8d5617bb2f"},"x-ethers":{"client":"ethers/6.11.1","gethFilename":"UTC--2024-02-15T17-47-15.0Z--1f9cc534ff25f2abe1753eb882b20130adcb2748","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"5f9832ed80383d6bd8d70f5c95a53027","mnemonicCiphertext":"f04fb4297e915ac04bffa6d46513544a","version":"0.1"}}
0x502bec5f280a5649b63e20a33dabf2e9009a029a6f23d82255338aac8cd5fce3 
0x1f9cc534FF25f2ABE1753eB882B20130adcb2748
 [
  'execute',  'salt',
  'describe', 'expect',
  'rescue',   'island',
  'script',   'check',
  'fiscal',   'october',
  'breeze',   'venue'
]  
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
  const { address } = await multichain.getAddressFromMnemonic(mnemonicPhrase);
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
  const { privateKey } = await multichain.exportPrivateKeyFromMnemonic(mnemonicPhrase);
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
  const { privateKey } = await multichain.exportPrivateKeyFromKeystore(keyStore, passCode);
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
  const { keyStore } = await multichain.importPrivateKey(privateKey, passCode);
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
  const { keyStore } = await multichain.importPrivateKey(mnemonicPhrase, passCode);
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

## verifyMnemonic
 ```bash
 async function verifyMnemonic() {
  passCode = "helloworld"
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
      ];  //the mnemonic to which you want to verify
  const mnemonicPhrase = mnemonic.join(' ')
  const { verify } = await multichan.verifyMnemonic(mnemonicPhrase, passCode);
  console.log(` verification  ${verify}`);
}
verifyMnemonic();
```
- Reponse
 Returns a boolen: true or false
```bash
{
  verify: true
}
```

## getNativeBalance
```bash
const getBalanceNative = async()=>{
   const userAddress = "0x86bc300654DE52620bB871E8B0922e52d4a06E43";  
  const networkDetail = { rpcUrl: "https://go.getblock.io/31788de76faf4a1bb4f3e02d53ab32fc",  chainId:"56" }; 
   const { balance}=  await multichan.getBalanceNative(userAddress, networkDetail);

  console.log({balance})
}
getBalanceNative()
```
- Reponse
 Returns the native wallet balance formatted 
```bash
{
  balance: "0.0004"
}
```

## getBalanceERC20
```bash
const getBalanceERC20 = async()=>{
  const walletAddress = "0x86bc300654DE52620bB871E8B0922e52d4a06E43";
  const networkDetail = { rpcUrl: "https://bsc-mainnet.nodereal.io/v1/2bdae634f9e947bd90b08c63b3e21c0c",  chainId:"56" }; 
  const tokenAddress = "0xEF0146906fA7d0cD5Ba997d1F340B714e275317d"
  const { balance } = await multichan.getBalanceERC20(walletAddress, networkDetail, tokenAddress);

   console.log(balance)
}
getBalanceERC20()
```
- Reponse
 Returns the erc20 wallet balance formatted 
```bash
{ balance: '161268.403340769349615978' }
```

## getGasPrice
```bash
const getGasPrice = async()=>{
  const networkDetail = { rpcUrl: "https://bsc-mainnet.nodereal.io/v1/2bdae634f9e947bd90b08c63b3e21c0c",  chainId:"56" }; 
  const { gasPrice }= await multichan.getGasPrice(networkDetail);
   console.log(gasPrice)
}
getGasPrice()
```
- Reponse
 Returns the network gasPrice in Gwei formatted 
```bash
{
 gasPrice: '3.0'
}

```

## getGasLimit
```bash
const getWalletGasLimit = async()=>{
    const networkDetail = { rpcUrl: "https://bsc-mainnet.nodereal.io/v1/2bdae634f9e947bd90b08c63b3e21c0c",  chainId:"56" }; 
    const tokenAddress = "0xEF0146906fA7d0cD5Ba997d1F340B714e275317d"
    const fromAddress = "0x86bc300654DE52620bB871E8B0922e52d4a06E43" 
  
    const toAddress = "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"; 
    const amount = "0.00001"; 
    const data = "0x"; 
  const {gasLimit}  = await multichan.getGasLimit(fromAddress, toAddress, amount, data , networkDetail);

   console.log({gasLimit})
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
     const networkDetail = { rpcUrl: "https://bsc-mainnet.nodereal.io/v1/2bdae634f9e947bd90b08c63b3e21c0c",  chainId:"56" }; 
    const fromAddress = "0x86bc300654DE52620bB871E8B0922e52d4a06E43" 
    const toAddress = "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"; 
    const amount = "0.00001"; 
    const data = "0x"; 
  const { totalCost}  = await multichan.simulateTransactionCost(fromAddress, toAddress, amount, data , networkDetail);

   console.log({totalCost})
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
   *************************** sendTransaction*******************************
const signer ="6c7a59f2f019ed9ae8eef9e5bae9e83a837a2f67197011257bd4c0ef6611a300";

  const networkDetail = {
    rpcUrl:
      "https://bsc-mainnet.nodereal.io/v1/2bdae634f9e947bd90b08c63b3e21c0c",
    chainId: "56",
  };
  const toAddress = "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce";
  const amount = "0.00001";
  const { transactionHash } = await multichan.sendTransaction(
    signer,
    toAddress,
    amount,
    networkDetail
  );

  console.log({ transactionHash });
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
