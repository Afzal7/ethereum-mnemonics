const bip39 = require("bip39");
const bip32 = require("bip32");
const btc = require('bitcoinjs-lib');
const btcClient = require('bitcoin-core');
const W3 = require("./lib.js");


// W3.generateMnemonic();
// W3.generateSeed();
// generateAddress();
performTransaction();

function generateAddress(){
	const root = bip32.fromSeed(W3.seed)

	// // // To create a single address we’ll derive an address node. And then extract the address out of it.
	// // // derivation path:  m / purpose' / coin_type' / account' / change / address_index
	const addrNode = root.derivePath("m/44'/1'/0'/0/0"); //line 1
	var address = getAddress(addrNode)

	W3.print('address: ', address)
	W3.print('public key: ', addrNode.publicKey.toString('hex'))
	W3.print('private key: ', addrNode.privateKey.toString('hex'))
	W3.print('WIF: ', addrNode.toWIF())
	W3.print('extended private key: ', root.toWIF())
	W3.print('extended public key: ', root.neutered().toBase58())
}

function performTransaction(){
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
				txamt = Math.floor(data[0][0].amount * 100000000) // in satoshi

				txn.addInput(txid, 0)
				txn.addOutput('2N8zVTv31BadSqWsM923qaHKKgh4kCceDdv', txamt-5000)
				txn.sign(0, account)
				txnhex = txn.build().toHex();

				client.sendRawTransaction(txnhex, (result, data) => {
					if (result && result.name=="RpcError") {
						W3.print('transaction error: ',result.message);
					}
					else{
						finalTxid = data[0];
						W3.print("Final transaction ID: ", finalTxid)
					}
				});
			}
			else{
				W3.print('message: ', 'No unspent transactions present')
			}
		}
	});
}


function getAddress (node, network) {
  network = network || btc.networks.bitcoin
  return btc.address.toBase58Check(btc.crypto.hash160(node.publicKey), network.pubKeyHash)
}