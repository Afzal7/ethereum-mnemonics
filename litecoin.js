const bip39 = require("bip39");
const bitcoinjs = require('bitcoinjs-lib');
const W3 = require("./lib.js");
const bitcoinjsClient = require('bitcoin-core');
const litecoin = bitcoinjs.networks.litecoin;

const client = new bitcoinjsClient({
	headers: true,
	network: 'testnet',
	host: '127.0.0.1',
	password: 'password',
	port: 18833,
	username: 'litecoinrpc'
})

const ltctestnet = {
  messagePrefix: '\x18Litecoin Signed Message:\n',
  bip32: {
    public: 0x0436ef7d,
    private: 0x0436f6e1
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
  dustThreshold: 100000,
};

var mnemonic = 'keep possible coach vessel steel rice extend shop emotion enlist people moment';
var seed = bip39.mnemonicToSeed(mnemonic);
var root = bitcoinjs.HDNode.fromSeedHex(seed, ltctestnet);

var path = "m/44'/100002'/0'/0"

var extendedKey = root.derivePath(path)
var xprv = extendedKey.toBase58();
var xpub = extendedKey.neutered().toBase58();

W3.print('xprv: ', xprv)
W3.print('xpub: ', xpub)

var keyPair = new bitcoinjs.ECPair(extendedKey.keyPair.d, null, { network: ltctestnet, compressed: false });
var address = keyPair.getAddress()
var privkey = keyPair.toWIF();
var pubkey = keyPair.getPublicKeyBuffer().toString('hex');

W3.print('address: ', address)
W3.print('privkey: ', privkey)
W3.print('pubkey: ', pubkey)

client.importAddress(address, 'tinyblock', (result, data) => {
	W3.print('result: ', result);
	W3.print('data: ', data);
})

// var testAddress = 'mzGDidMD8RR6D1kfca8rw2kWoyucEQKM2u';
// var testWIF = '92Y6NPoKLZfefx4T9t9KJkmqjiWABX49x6mPtgWGC1tPmKVDNwT';

// var account = bitcoinjs.ECPair.fromWIF(testWIF, ltctestnet);
// var finalTxid, txnhex;
// var txn = new bitcoinjs.TransactionBuilder(ltctestnet);