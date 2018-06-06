const bip39 = require("bip39");
const bip32 = require("bip32");
const btc = require('bitcoinjs-lib');
const btcClient = require('bitcoin-core');
const W3 = require("./lib.js");
var MININGFEE = 1000;

const client = new btcClient({
	headers: true,
	network: 'testnet',
	host: '52.15.65.61',
	password: 'secretpassword',
	port: 18332,
	username: 'alt247'
})


// W3.generateMnemonic();
// W3.generateSeed();
// generateAddress();
performTransaction(1000000, '2N8zVTv31BadSqWsM923qaHKKgh4kCceDdv');


function generateAddress(){
	const root = bip32.fromSeed(W3.seed)

	const addrNode = root.derivePath("m/44'/0'/0'/0/0"); //line 1
	var address = getAddress(addrNode)

	W3.print('address: ', address)
	W3.print('public key: ', addrNode.publicKey.toString('hex'))
	W3.print('private key: ', addrNode.privateKey.toString('hex'))
	W3.print('WIF: ', addrNode.toWIF())
	W3.print('extended private key: ', root.toWIF())
	W3.print('extended public key: ', root.neutered().toBase58())

	client.importAddress(address, 'tinyblock', (result, data) => {
		W3.print('result: ', result);
		W3.print('data: ', data);
	})
}

function performTransaction(amount, recipient){
	var testWIF = 'cQCcR6LGxxL8RCdKxhzEsbYbiR2YfP7kUPiGsaQFXnYSubmREcxP';
	var address = 'mpTeFyADfMv5JCsAj7hYCtz9QzuvL7ZVrn';
	var account = btc.ECPair.fromWIF(testWIF, btc.networks.testnet);
	var finalTxid, txnhex;
	var txn = new btc.TransactionBuilder(btc.networks.testnet);

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

				if (input <= (amount + MININGFEE)){
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


function getAddress (node, network) {
  network = network || btc.networks.bitcoin
  return btc.address.toBase58Check(btc.crypto.hash160(node.publicKey), network.pubKeyHash)
}

function toSatoshi(amount){
	return Math.floor(amount * 100000000);
}