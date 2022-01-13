const setAuthorizationHeader = require('./src/setAuthorizationHeader');
const setSignature = require('./src/setSignature');
const { v4: uuidv4 } = require('uuid');

module.exports.requestHooks = [
  setAuthorizationHeader
];

module.exports.responseHooks = [
  setSignature
];

module.exports.templateTags = [
  {
    name: 'batchId',
    displayName: 'Generate Batch ID',
    description: 'Generate Batch ID',
    async run() {
      return uuidv4();
    }
  }
];
