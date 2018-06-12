const bitcoinjs = require('bitcoinjs-lib');
const W3Main = require("./w3_main.js");
const bitcoinjsClient = require('bitcoin-core');
const litecoin = bitcoinjs.networks.litecoin;
var MININGFEE = 10000

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

var W3Litecoin = function(){

	var self = this;

	self.init = function(){
		// console.log(bitcoinjs.networks)
		self.initClient();
	}
	
	self.initClient = function(){
		self.client = new bitcoinjsClient({
			headers: true,
			network: 'testnet',
			host: '127.0.0.1',
			password: 'password',
			port: 18833,
			username: 'litecoinrpc'
		});
	}

	self.initWallet = function(){
		W3Main.initWallet('LTC', litecoin)

		var keyPair = new bitcoinjs.ECPair(W3Main.node.keyPair.d, null, { network: litecoin, compressed: true });
		self.address = keyPair.getAddress();
		self.privkey = keyPair.toWIF();

		W3Main.print('Litecoin address: ', self.address)
		W3Main.print('Litecoin privkey: ', self.privkey)

		self.client.importAddress(self.address, 'tinyblock', (result, data) => {
			W3Main.print('result: ', result);
			W3Main.print('data: ', data);
		});
	}

	self.initTx = function(amount, recipient){
		var testAddress = 'mzGDidMD8RR6D1kfca8rw2kWoyucEQKM2u';
		var testWIF = '92Y6NPoKLZfefx4T9t9KJkmqjiWABX49x6mPtgWGC1tPmKVDNwT';

		var account = bitcoinjs.ECPair.fromWIF(testWIF, ltctestnet);
		var finalTxid, txnhex;
		var txn = new bitcoinjs.TransactionBuilder(ltctestnet);

		self.client.listUnspent(6, 9999999, [testAddress], (result, transactions) => {
			if (result && result.name=="RpcError") {
				W3Main.print('Litecoin transaction error: ', result.message);
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
						W3Main.print('Litecoin transaction error: ', 'Insufficient funds');
					}
					else{
						change = input - (amount + MININGFEE);
						txn.addOutput(recipient, amount);
						if (change){
							txn.addOutput(testAddress, change);
						}

						for (var i = 0; i < transactionsUsed; i++) {
							txn.sign(i, account);
						}

						txnhex = txn.build().toHex();
						W3Main.print("Litecoin transaction txnhex: ", txnhex);

						self.client.sendRawTransaction(txnhex, (result, data) => {
							if (result && result.name=="RpcError") {
								W3Main.print('transaction error: ',result.message);
							}
							else{
								finalTxid = data[0];
								W3Main.print("Litecoin transaction Final transaction ID: ", finalTxid)
							}
						});
					}
				}
				else{
					console.log("Litecoin transaction error:  No unspent transactions present")
				}
			}
		});
	}

	self.toSatoshi = function(amount){
		return Math.floor(amount * 100000000);
	}

}

module.exports = new W3Litecoin();
