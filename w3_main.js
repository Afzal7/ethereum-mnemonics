const bip39 = require("bip39");
const bip32 = require("bip32");
const CoinList = require("./coin_list.js");

var W3Main = function(){
	var self = this;

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
		// self.root = hdkey.fromMasterSeed(self.seed);
		self.root = bip32.fromSeed(self.seed)
		self.print('root: ', self.root);

		masterPrivateKey = self.root.privateKey.toString('hex');
		self.print('masterPrivateKey: ', masterPrivateKey);

		masterPublicKey = self.root.publicKey.toString('hex');
		self.print('masterPublicKey: ', masterPublicKey);
	}

	self.generateNode = function(coin_symbol){
		// To create a single address we’ll derive an address node. And then extract the address out of it.
		// derivation path:  m / purpose' / coin_type' / account' / change / address_index
		self.print('Generating node for ', CoinList[coin_symbol].bip_44_code);

		self.node = self.root.derivePath("m/44'/"+CoinList[coin_symbol].bip_44_code+"'/0'/0/0"); //line 1
		self.print('node:', self.node);

		self.print('node._privateKey: ', self.node.privateKey.toString('hex'));
	}

	self.initWallet = function(coin_symbol){
		self.print('Initiating Wallet for', coin_symbol);

		self.generateMnemonic();
		self.generateSeed();
		self.generateRoot();
		self.generateNode(coin_symbol);
	}
};
module.exports = new W3Main();