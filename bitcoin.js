const bip39 = require("bip39");
const bip32 = require("bip32");
const btc = require('bitcoinjs-lib');
const btcClient = require('bitcoin-core')

print('Libraries Loaded!');

// Generating Wordlist
const mnemonic = bip39.generateMnemonic();
print('mnemonic: ', mnemonic);

// // Generating Seed Buffer
const seed = bip39.mnemonicToSeed(mnemonic);
print('seed: ', seed);

// // Generating Root of the node tree
const root = bip32.fromSeed(seed)
print('root: ', root);

// // To create a single address we’ll derive an address node. And then extract the address out of it.
// // derivation path:  m / purpose' / coin_type' / account' / change / address_index
const addrNode = root.derivePath("m/44'/1'/0'/0/0"); //line 1
print('addrNode:', addrNode);

var address = getAddress(addrNode, btc.networks.testnet)

// var address = addrNode.publicKey;
print('address: ', address);
print('private address: ', addrNode.toWIF())
print('extended public key: ', root.neutered().toBase58())
print('extended private key: ', root.toWIF())


function print(name, message=''){
	console.log('');
	console.log(name, message);
	console.log('');
}

function getAddress (node, network) {
  network = network || btc.networks.bitcoin
  return btc.address.toBase58Check(btc.crypto.hash160(node.publicKey), network.pubKeyHash)
}