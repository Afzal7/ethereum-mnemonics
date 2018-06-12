// Source Article: https://medium.com/bitcraft/so-you-want-to-build-an-ethereum-hd-wallet-cb2b7d7e4998
// testnet Account = 2fcc8c72e3b26f2eea74a43520972c3f3cbff185
// infura = 5GZBABYhPzfctlTOIiXu
const bip39 = require("bip39");
const hdkey = require("hdkey");
const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');
const Web3 = require("web3");
const W3Main = require("./w3_main.js");
const W3Ether = require("./w3_ether.js");
const W3Bitcoin = require("./w3_bitcoin.js");
const W3Litecoin = require("./w3_litecoin.js");

W3Main.exportWallets();
W3Main.importWallets();

// W3Ether.init();
// W3Ether.initWallet();
// W3Ether.getBalance('0x99A5255df833AB35Cf5d9EA52e3aEDc697B49bba').then(function(data){
// 	console.log('Sender balance:', W3Ether.toEther(data));
// });


// W3Ether.initTx('0x99A5255df833AB35Cf5d9EA52e3aEDc697B49bba', '0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8', '2');

// W3Ether.getBalance('0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8').then(function(data){
// 	console.log('Reciever balance:', W3Ether.toEther(data));

// 	// W3Ether.initTx('0x99A5255df833AB35Cf5d9EA52e3aEDc697B49bba', '0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8', '1000000000000000000');
// 	// W3Ether.initTx('0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8', '0x99A5255df833AB35Cf5d9EA52e3aEDc697B49bba', '1000000000000000000');
// });

// W3Bitcoin.init();
// W3Bitcoin.initWallet();
// W3Bitcoin.initTx(W3Bitcoin.toSatoshi(0.01), '2N8JJbbNSZLyfiRW5TeL8hATy9r2Ras6TUt');
// W3Bitcoin.getBalance('2N8JJbbNSZLyfiRW5TeL8hATy9r2Ras6TUt');


// W3Litecoin.init();
// W3Litecoin.initWallet();
// W3Litecoin.initTx(W3Litecoin.toSatoshi(1), 'mkga1we9vQPJ8oXJQiuYNB3TbcLLagJAV4');
