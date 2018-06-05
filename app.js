// Source Article: https://medium.com/bitcraft/so-you-want-to-build-an-ethereum-hd-wallet-cb2b7d7e4998

const bip39 = require("bip39");
const hdkey = require("hdkey");
const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');
const Web3 = require("web3");

print('Libraries Loaded!');

// // Generating Wordlist
const mnemonic = bip39.generateMnemonic();
print('mnemonic: ', mnemonic);

// // Generating Seed Buffer
const seed = bip39.mnemonicToSeed(mnemonic);
print('seed: ', seed);

// // Generating Root of the node tree
const root = hdkey.fromMasterSeed(seed);
print('root: ', root);

// // Root Private key 
const masterPrivateKey = root.privateKey.toString('hex');
print('masterPrivateKey: ', masterPrivateKey);

// // Root Public key 
const masterPublicKey = root.publicKey.toString('hex');
print('masterPublicKey: ', masterPublicKey);

// // To create a single address we’ll derive an address node. And then extract the address out of it.
// // derivation path:  m / purpose' / coin_type' / account' / change / address_index
const addrNode = root.derive("m/44'/60'/0'/0/0"); //line 1
print('addrNode:', addrNode);

print('addrNode._privateKey: ', addrNode._privateKey.toString('hex'));

const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
print('pubKey:', pubKey);

const addr = ethUtil.publicToAddress(pubKey).toString('hex');
print('addr:', addr);

const address = ethUtil.toChecksumAddress(addr);
print('address:', address);

// Making A transaction 
// const params = {
//   nonce: 0,
//   to: '0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8',
//   value: '0.1',
//   gasPrice: 5000000000,
//   gasLimit: 21000,
//   chainId: 3
// };

// const tx = new ethTx(params);
// print('tx:', tx);

// //Signing the transaction with the correct private key
// const privateKey = Buffer.from('986f881c1d513aa7d0ede27705a7cf6e02e6e0cb50b05ea09f000c562a666468', 'hex')

// // tx.sign(addrNode._privateKey);
// tx.sign(privateKey);
// print('signed tx:', tx);

// const serializedTx = tx.serialize()
// print('serializedTx:', serializedTx);

// const web3 = new Web3(
// 	new Web3.providers.HttpProvider('http://127.0.0.1:8545')
// );
// // print('givenProvider', Web3.givenProvider);
// // var web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8546");

// // print('web3', web3);

// // Verify connection
// web3.eth.net.isListening()
// 	.then(() => console.log('is connected'))
// 	.catch(e => console.log('Something went wrong'));


// web3.eth.sendSignedTransaction(
//    `0x${serializedTx.toString('hex')}`, 
//    (error, result) => { 
//       if (error) { console.log(`Error: ${error}`); }  
//       else { console.log(`Result: ${result}`); } 
//    } 
// );


// A Print function to print messages cleanly. 
function print(name, message=''){
	console.log('');
	console.log(name, message);
	console.log('');
}