const W3Main = require("./w3_main.js");
const RippleAPI = require('ripple-lib').RippleAPI;
const rippleKeyPairs = require("ripple-keypairs");
const Base58 = require("base-58");

var codedString = Base58.encode(new Buffer("Hello world"));
console.log(codedString);

W3Main.generateMnemonic();

W3Main.generateSeed();
console.log(Base58.encode(W3Main.seed));

const seed = rippleKeyPairs.generateSeed();
console.log(seed);

const keypair = rippleKeyPairs.deriveKeypair(Base58.encode(W3Main.seed));
console.log(keypair);

const address = rippleKeyPairs.deriveAddress(keypair.publicKey);
console.log(address);

// const api = new RippleAPI({
//   // server: 'wss://s1.ripple.com' // Public rippled server
//   server: 'wss://s.altnet.rippletest.net:51233'
// });
// api.connect().then(() => {
//   /* begin custom code ------------------------------------ */
//   const myAddress = 'rLPm5jcsEwZzRADNvAY7jzeJghtyeyuxjA';

//   console.log('getting account info for', myAddress);
//   return api.getAccountInfo(myAddress);

// }).then(info => {
//   console.log(info);
//   console.log('getAccountInfo done');

//   /* end custom code -------------------------------------- */
// }).then(() => {
//   return api.disconnect();
// }).then(() => {
//   console.log('done and disconnected.');
// }).catch(console.error);