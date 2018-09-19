const W3Main = require("./w3_main.js");
const RippleAPI = require('ripple-lib').RippleAPI;
const rippleKeyPairs = require("ripple-keypairs");
const rippleBip32 = require("ripple-bip32");

// W3Main.generateMnemonic();

// W3Main.generateSeed();
// console.log(W3Main.seed);

// const m = rippleBip32.fromSeedBuffer(W3Main.seed)
// // master xprv
// console.log(m.toBase58())

// const keypair = m.derivePath("m/44'/144'/0'/0/0").keyPair.getKeyPairs();
// console.log(keypair);

// console.log('123123123123123123123123123123123')

// const seed = rippleKeyPairs.generateSeed();
// console.log(seed);

// const keypair = rippleKeyPairs.deriveKeypair(seed);
// console.log(keypair);

// const address = rippleKeyPairs.deriveAddress(keypair.publicKey);
// console.log(address);

// const api = new RippleAPI({
//   // server: 'wss://s1.ripple.com' // Public rippled server
//   server: 'wss://s.altnet.rippletest.net:51233'
// });
// api.connect().then(() => {
//     const myAddress = 'rUruPq5e7TmztMJKn9CRSVuwTFr9YVfXra';

//   console.log('getting account info for', myAddress);
//   return api.getAccountInfo(myAddress);

// }).then(info => {
//   console.log(info);
//   console.log('getAccountInfo done');

// }).then(() => {
//   return api.disconnect();
// }).then(() => {
//   console.log('done and disconnected.');
// }).catch(console.error);






const address = 'rEjjperoRuYeUwwjWeWiGFeRsFTorn26aZ';
const secret = 'spvxpgKvgLnquhQDYh8FV9bgtavxj';

const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
const instructions = {maxLedgerVersionOffset: 5};

const payment = {
  source: {
    address: address,
    maxAmount: {
      value: '1',
      currency: 'XRP'
    }
  },
  destination: {
    address: 'rhXBf3RA9767XXqafdPsoA8u7QfrGWToUG',
    amount: {
      value: '0.9',
      currency: 'XRP'
    }
  }
};

function quit(message) {
  console.log(message);
  process.exit(0);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

api.connect().then(() => {
  console.log('Connected...');
  return api.preparePayment(address, payment, instructions).then(prepared => {
    console.log('Payment transaction prepared...');
    const {signedTransaction} = api.sign(prepared.txJSON, secret);
    console.log('Payment transaction signed...');
    api.submit(signedTransaction).then(quit, fail);
  });
}).catch(fail);