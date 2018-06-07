// Source Article: https://medium.com/bitcraft/so-you-want-to-build-an-ethereum-hd-wallet-cb2b7d7e4998
// testnet Account = 2fcc8c72e3b26f2eea74a43520972c3f3cbff185
// infura = 5GZBABYhPzfctlTOIiXu
const bip39 = require("bip39");
const hdkey = require("hdkey");
const ethUtil = require('ethereumjs-util');
const ethTx = require('ethereumjs-tx');
const Web3 = require("web3");
const W3Ether = require("./w3_ether.js");
const W3Bitcoin = require("./bitcoin.js")

W3Ether.init();
W3Ether.initWallet();

W3Bitcoin.init();
W3Bitcoin.initWallet();

W3Ether.initTx('0x99A5255df833AB35Cf5d9EA52e3aEDc697B49bba', '0xdc95f34b6E36C7fefd6BCe81613c0118d188A1F8', '2');
W3Bitcoin.initTx(W3Bitcoin.toSatoshi(0.01), '2N8JJbbNSZLyfiRW5TeL8hATy9r2Ras6TUt');
W3Bitcoin.getBalance('mpTeFyADfMv5JCsAj7hYCtz9QzuvL7ZVrn');