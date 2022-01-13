const setAuthorizationHeader = require('./src/setAuthorizationHeader');
const setSignature = require('./src/setSignature');

module.exports.requestHooks = [
  setAuthorizationHeader
];

module.exports.responseHooks = [
  setSignature
];
