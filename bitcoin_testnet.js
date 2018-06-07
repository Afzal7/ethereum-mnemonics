const bip39 = require("bip39");
const bitcoinjs = require('bitcoinjs-lib');
const W3 = require("./lib.js");
const bitcoin = bitcoinjs.networks.bitcoin;

// console.log(ltc.networks)

// mnemonic = W3.generateMnemonic();
// seed = bip39.mnemonicToSeed(mnemonic);
// bip32RootKey = bitcoinjs.HDNode.fromSeedHex(seed, bitcoinjs.networks.bitcoin);

// path = "m/44'/0'/0'/0"

// extendedKey = bip32RootKey.derivePath(path)
// xprv = extendedKey.toBase58();
// xpub = extendedKey.neutered().toBase58();
// W3.print('xprv: ', xprv)
// W3.print('xpub: ', xpub)

// keyPair = new bitcoinjs.ECPair(extendedKey.keyPair.d, null, { network: bitcoin, compressed: false });
// address = keyPair.getAddress()
// privkey = keyPair.toWIF();
// pubkey = keyPair.getPublicKeyBuffer().toString('hex');

// W3.print('address: ', address)
// W3.print('privkey: ', privkey)
// W3.print('pubkey: ', pubkey)
