const W3Main = require("./w3_main.js");
const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');
const Web3 = require("web3");

var W3Ether = function(){

	var self = this;
	self.infura_ley = '5GZBABYhPzfctlTOIiXu'
	self.networkUrl = 'https://ropsten.infura.io/'+self.infura_ley;

	self.init = function(){
		self.initWeb3();
	}

	self.initWeb3 = function(){
		// var web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8546"); 
		self.web3 = new Web3(new Web3.providers.HttpProvider(self.networkUrl));
	}

	self.print = function(name, message=''){
		console.log('');
		console.log(name, message);
		console.log('');
	}

	// 
	// Wallet Generation related Functions
	// 

	self.generateAddress = function(){
		pubKey = ethUtil.privateToPublic(W3Main.node.privateKey);
		self.print('pubKey:', pubKey);

		addr = ethUtil.publicToAddress(pubKey).toString('hex');
		self.print('addr:', addr);

		address = ethUtil.toChecksumAddress(addr);
		self.print('address:', address);
	}

	self.initWallet = function(){
		W3Main.initWallet('ETH');
		self.generateAddress();
	}

	// 
	// Transaction related Functions
	// 
	
	self.toHex = function(value){
		return self.web3.utils.toHex(value);
	}

	self.toEther = function(value){
		return self.web3.utils.fromWei(value, 'ether');
	}

	self.getBalance = function(public_address){
		return self.web3.eth.getBalance(public_address);
	}

	self.getTxCount = function(public_address){
		return self.web3.eth.getTransactionCount(public_address);
	}

	self.sendTx = function(to_address, nonce, value){
		var params = {
		  nonce: nonce,
		  to: to_address,//'0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8'
		  value: self.web3.utils.toHex(value), //value,
		  gasPrice: self.web3.utils.toHex(5000000000),
		  gasLimit: self.web3.utils.toHex(25000),
		  chainId: 3
		};

		self.print('Tx Params:', params);

		var tx = new ethTx(params);

		var privateKey = Buffer.from('986f881c1d513aa7d0ede27705a7cf6e02e6e0cb50b05ea09f000c562a666468', 'hex')
		
		// tx.sign(self.node._privateKey);
		tx.sign(privateKey);

		var serializedTx = tx.serialize()
		self.print('serializedTx:', serializedTx);
		
		self.web3.eth.sendSignedTransaction(
		  `0x${serializedTx.toString('hex')}`, 
		  (error, result) => { 
		    if (error) { console.log(`Error: ${error}`); }  
		    else { console.log(`Result: ${result}`); } 
		  } 
		);
	}

	self.initTx = function(from_address, to_address, value){		
		self.getTxCount(from_address).then(function(data){
			self.print('Transaction count:', data);
			txCount = self.toHex(data);

			self.sendTx(to_address, txCount, value);
		});
	}
}

module.exports = new W3Ether();