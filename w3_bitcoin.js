const W3Main = require("./w3_main.js");
const bitcoinjs = require('bitcoinjs-lib');
const btcClient = require('bitcoin-core');
var MININGFEE = 10000;


var W3Bitcoin = function(){

	var self = this;

	self.init = function(){
		self.initBTCClient();
	}

	self.initBTCClient = function(){	
		self.client = new btcClient({
			headers: true,
			network: 'testnet',
			host: '13.232.249.83',
			password: 'bitcoin',
			port: 18332,
			username: 'bitcoin'
		});
	}
	
	self.initWallet = function(){
		W3Main.initWallet('BTC', bitcoinjs.networks.testnet);
		const testnet = bitcoinjs.networks.testnet
		var keyPair = new bitcoinjs.ECPair(W3Main.node.keyPair.d, null, { compressed: true, network: testnet });
		self.address = keyPair.getAddress();
		self.privkey = keyPair.toWIF();

		W3Main.print('BTC address: ', self.address);
		W3Main.print('BTC Private Key: ', self.privkey);

		self.client.importAddress(self.address, 'tinyblocks', (result, data) => {
			W3Main.print('result: ', result);
			W3Main.print('data: ', data);
		})
	}

	self.getAddress = function(node){
	  var network = bitcoinjs.networks.bitcoin
	  return bitcoinjs.address.toBase58Check(bitcoinjs.crypto.hash160(node.publicKey), network.pubKeyHash)
	}

	self.toSatoshi = function(amount){
		return Math.floor(amount * 100000000);
	}

	self.initTx = function(amount, recipient){
		var testWIF = 'cNStKLtwPbcg46tVXakvjHYvper1cyG38Q5wr7ryrUJGs8R9tb38';
		var address = 'muv8JgWmTtCfQNswQn6xN7PvugyHQMvN7v';
		var account = bitcoinjs.ECPair.fromWIF(testWIF, bitcoinjs.networks.testnet);
		var finalTxid, txnhex;
		var txn = new bitcoinjs.TransactionBuilder(bitcoinjs.networks.testnet);

		self.client.listUnspent(6, 9999999, [address], (result, transactions) => {
			if (result && result.name=="RpcError") {
				W3Main.print('Bitcoin error: ', result.message);
			}
			else{
				if (transactions[0].length) {
					var transactionsUsed = 0, input = 0, change;
					for(var transaction of transactions[0]){
						txn.addInput(transaction.txid, transaction.vout);
						input += self.toSatoshi(transaction.amount);
						transactionsUsed += 1;
						if (input>=amount) break;
					}

					if (input <= (amount + MININGFEE)){
						W3Main.print('Bitcoin error: ', 'Insufficient funds');
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
						W3Main.print("Bitcoin txnhex: ", txnhex);

						self.client.sendRawTransaction(txnhex, (result, data) => {
							if (result && result.name=="RpcError") {
								W3Main.print('transaction error: ',result.message);
							}
							else{
								finalTxid = data[0];
								W3Main.print("Bitcoin Final transaction ID: ", finalTxid)
							}
						});
					}
				}
				else{
					console.log("Bitcoin error:  No unspent transactions present")
				}
			}
		});		
	}

	self.getBalance = function(address){
		var balance = 0;
		self.client.listUnspent(6, 9999999, [address], (result, transactions) => {
			W3Main.print("Result: ", result);
			W3Main.print("Transactions: ", transactions);
			if (result && result.name=="RpcError") {
				W3Main.print('Bitcoin error: ', result.message);
			}
			else{
				if (transactions[0].length) {
					for(var transaction of transactions[0]){
						balance += transaction.amount;
					}
				}
			}
			W3Main.print("Balance for address '"+address+"': ", balance )
		});
	}

}

module.exports = new W3Bitcoin();
