const bip39 = require("bip39");
const bip32 = require("bip32");
const btc = require('bitcoinjs-lib');
const btcClient = require('bitcoin-core');

// print('Libraries Loaded!');

// // Generating Wordlist
// const mnemonic = 'coyote water cereal blood visual east mercy door raccoon helmet mule finger'
// print('mnemonic: ', mnemonic);

// // // // Generating Seed Buffer
// const seed = bip39.mnemonicToSeed(mnemonic);
// print('seed: ', seed);

// // // // Generating Root of the node tree
// const root = bip32.fromSeed(seed)
// // print('root: ', root);

// // // // To create a single address we’ll derive an address node. And then extract the address out of it.
// // // // derivation path:  m / purpose' / coin_type' / account' / change / address_index
// const addrNode = root.derivePath("m/44'/1'/0'/0/0"); //line 1
// // print('addrNode:', addrNode);

// var address = getAddress(addrNode, btc.networks.testnet)

// print('testnet: ',btc.networks.testnet)
// // var address = addrNode.publicKey;
// print('address: ', address)
// print('public key: ', addrNode.publicKey.toString('hex'))
// print('private key: ', addrNode.privateKey.toString('hex'))
// print('WIF: ', addrNode.toWIF())
// print('extended private key: ', root.toWIF())
// print('extended public key: ', root.neutered().toBase58())

var testWIF = 'cQCcR6LGxxL8RCdKxhzEsbYbiR2YfP7kUPiGsaQFXnYSubmREcxP' 
var address = 'mpTeFyADfMv5JCsAj7hYCtz9QzuvL7ZVrn'
var account = btc.ECPair.fromWIF(testWIF, btc.networks.testnet)

const client = new btcClient({
	headers: true,
	network: 'testnet',
	host: '52.15.65.61',
	password: 'secretpassword',
	port: 18332,
	username: 'alt247'
})

var txid, txamt, finalTxid, txnhex;
var txn = new btc.TransactionBuilder(btc.networks.testnet);

client.listUnspent(1, 9999999, [address], (result, data) => {
	if (result && result.name=="RpcError") {
		print('error: ', result.message)
	}
	else{
		if (data[0].length) {
			txid= data[0][0].txid
			txamt = data[0][0].amount * 100000000 // in satoshi

			txn.addInput(txid, 0)
			txn.addOutput('2N8zVTv31BadSqWsM923qaHKKgh4kCceDdv', txamt-5000)
			txn.sign(0, account)
			txnhex = txn.build().toHex();

			client.sendRawTransaction(txnhex, (result, data) => {
				if (result && result.name=="RpcError") {
					print('transaction error: ',result.message);
				}
				else{
					finalTxid = data[0];
					print("Final transaction ID: ", finalTxid)
				}
			});
		}
		else{
			print('message: ', 'No unspent transactions present')
		}
	}
});

function print(name, message=''){
	console.log('');
	console.log(name, message);
	console.log('');
}

function getAddress (node, network) {
  network = network || btc.networks.bitcoin
  return btc.address.toBase58Check(btc.crypto.hash160(node.publicKey), network.pubKeyHash)
}