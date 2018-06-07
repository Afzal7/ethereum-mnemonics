const bip39 = require("bip39");
const bitcoinjs = require('bitcoinjs-lib');
const bitcoinjsClient = require('bitcoin-core');
const W3 = require("./lib.js");
var MININGFEE = 10000;
var live = bitcoinjs.networks.bitcoin;
var testnet = bitcoinjs.networks.testnet;

const client = new bitcoinjsClient({
	headers: true,
	network: 'testnet',
	host: '52.15.65.61',
	password: 'secretpassword',
	port: 18332,
	username: 'alt247'
})


W3.generateMnemonic();
W3.generateSeed();
generateAddress(testnet);
// performTransaction(1000000, '2N8zVTv31BadSqWsM923qaHKKgh4kCceDdv');
// calculateBalance('mpTeFyADfMv5JCsAj7hYCtz9QzuvL7ZVrn');

function generateAddress(network){
	var root = bitcoinjs.HDNode.fromSeedHex(W3.seed, network);
	const addrNode = root.derivePath("m/44'/1'/0'/0/0"); //line 1
	var xprv = addrNode.toBase58();
	var xpub = addrNode.neutered().toBase58();
	var keyPair = new bitcoinjs.ECPair(addrNode.keyPair.d, null, { network: network, compressed: false });
	var address = keyPair.getAddress()
	var privkey = keyPair.toWIF();
	var pubkey = keyPair.getPublicKeyBuffer().toString('hex');

	W3.print('address: ', address)
	W3.print('public key: ', pubkey)
	W3.print('private key: ', privkey)
	W3.print('extended private key: ', xprv)
	W3.print('extended public key: ', xpub)

	client.importAddress(address, 'tinyblock', (result, data) => {
		W3.print('result: ', result);
		W3.print('data: ', data);
	})
}

function performTransaction(amount, recipient){
	var testWIF = 'cQCcR6LGxxL8RCdKxhzEsbYbiR2YfP7kUPiGsaQFXnYSubmREcxP';
	var address = 'mpTeFyADfMv5JCsAj7hYCtz9QzuvL7ZVrn';
	var account = bitcoinjs.ECPair.fromWIF(testWIF, bitcoinjs.networks.testnet);
	var finalTxid, txnhex;
	var txn = new bitcoinjs.TransactionBuilder(bitcoinjs.networks.testnet);

	client.listUnspent(1, 9999999, [address], (result, transactions) => {
		if (result && result.name=="RpcError") {
			W3.print('error: ', result.message);
		}
		else{
			if (transactions[0].length) {
				var transactionsUsed = 0, input = 0, change;

				for(var transaction of transactions[0]){
					txn.addInput(transaction.txid, transaction.vout);
					input += toSatoshi(transaction.amount);
					transactionsUsed += 1;
					if (input>=amount) break;
				}

				if (input < (amount + MININGFEE)){
					W3.print('error: ', 'Insufficient funds');
				}
				else{
					change = input - (amount + MININGFEE);
					txn.addOutput(recipient, amount);
					if (change){
						txn.addOutput(address, change);
					}

					for (var i = 0; i < transactionsUsed; i++) {
						txn.sign(i, account);
					}

					txnhex = txn.build().toHex();
					W3.print("txnhex: ", txnhex);

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
			}
			else{
				console.log("No unspent transactions present")
			}
		}
	});
}

function calculateBalance(address){
	var balance = 0;
	client.listUnspent(1, 9999999, [address], (result, transactions) => {
		if (result && result.name=="RpcError") {
			W3.print('error: ', result.message);
		}
		else{
			if (transactions[0].length) {
				for(var transaction of transactions[0]){
					balance += transaction.amount;
				}
			}
			W3.print('balance: ', balance)
		}
	});
	return balance;
}


function getAddress (node, network) {
  network = network || bitcoinjs.networks.bitcoin
  return bitcoinjs.address.toBase58Check(bitcoinjs.crypto.hash160(node.publicKey), network.pubKeyHash)
}

function toSatoshi(amount){
	return Math.floor(amount * 100000000);
}