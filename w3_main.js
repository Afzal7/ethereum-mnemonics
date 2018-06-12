const bip39 = require("bip39");
const bip32 = require("bip32");
const CoinList = require("./coin_list.js");
const bitcoinjs = require('bitcoinjs-lib');

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
		self.mnemonic = self.mnemonic || 'sauce apple trust addict quiz exchange demand bulk almost clock notice glide';
		self.print('mnemonic: ', self.mnemonic);
	}

	self.generateSeed = function(){
		self.seed = self.seed || bip39.mnemonicToSeed(self.mnemonic);
	}

	self.generateRoot = function(coin_symbol, network){
		if (coin_symbol=='eth' || coin_symbol=='ETH') {
			self.root = bip32.fromSeed(self.seed)
			masterPrivateKey = self.root.privateKey.toString('hex');
			self.print('masterPrivateKey: ', masterPrivateKey);

			masterPublicKey = self.root.publicKey.toString('hex');
			self.print('masterPublicKey: ', masterPublicKey);
		}
		else{
			network = network || bitcoinjs.networks.bitcoin
			self.root = bitcoinjs.HDNode.fromSeedHex(self.seed, network);

			var extendedPubKey = self.root.neutered().toBase58();
			var extendedPrivKey = self.root.toBase58();

			self.print('Extended public key: ', extendedPubKey)
			self.print('Extended private key: ', extendedPrivKey)
		}
	}

	self.generateNode = function(coin_symbol){
		// To create a single address we’ll derive an address node. And then extract the address out of it.
		// derivation path:  m / purpose' / coin_type' / account' / change / address_index
		self.print('Generating node for ', CoinList[coin_symbol].bip_44_code);

		self.node = self.root.derivePath("m/44'/"+CoinList[coin_symbol].bip_44_code+"'/0'/0/0"); //line 1
		if (coin_symbol == 'ETH') {
			self.print('node.privateKey: ', self.node.privateKey.toString('hex'));
		}
	}

	self.initWallet = function(coin_symbol, network){
		self.print('Initiating Wallet for', coin_symbol);

		self.generateMnemonic();
		self.generateSeed();
		self.generateRoot(coin_symbol, network);
		self.generateNode(coin_symbol);
	}

	self.toSatoshi = function(amount){
		return Math.floor(amount * 100000000);
	}

};
module.exports = new W3Main();