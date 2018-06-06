const bip39 = require("bip39");
const hdkey = require("hdkey");
const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');
const Web3 = require("web3");

var W3 = function(){

	self = this;
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

	self.generateMnemonic = function(){
		self.mnemonic = bip39.generateMnemonic();
		self.print('mnemonic: ', self.mnemonic);
	}

	self.generateSeed = function(){
		self.seed = bip39.mnemonicToSeed(self.mnemonic);
		self.print('seed: ', self.seed);
	}

	self.generateRoot = function(){
		self.root = hdkey.fromMasterSeed(self.seed);
		self.print('root: ', self.root);

		masterPrivateKey = self.root.privateKey.toString('hex');
		self.print('masterPrivateKey: ', masterPrivateKey);

		masterPublicKey = self.root.publicKey.toString('hex');
		self.print('masterPublicKey: ', masterPublicKey);
	}

	self.generateNode = function(){
		// To create a single address we’ll derive an address node. And then extract the address out of it.
		// derivation path:  m / purpose' / coin_type' / account' / change / address_index
		self.node = self.root.derive("m/44'/60'/0'/0/0"); //line 1
		self.print('node:', self.node);

		self.print('node._privateKey: ', self.node._privateKey.toString('hex'));

		pubKey = ethUtil.privateToPublic(self.node._privateKey);
		self.print('pubKey:', pubKey);

		addr = ethUtil.publicToAddress(pubKey).toString('hex');
		self.print('addr:', addr);

		address = ethUtil.toChecksumAddress(addr);
		self.print('address:', address);
	}

	self.initWallet = function(){
		self.generateMnemonic();
		self.generateSeed();
		self.generateRoot();
		self.generateNode();
	}

	// 
	// Transaction related Functions
	// 
	
	self.toHex = function(value){
		return self.web3.utils.toHex(value);
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

module.exports = new W3();