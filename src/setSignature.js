const {
  Transaction,
  Nonce,
  Balance,
  Address,
  GasPrice,
  GasLimit,
  TransactionPayload,
  ChainID,
  TransactionVersion,
  Mnemonic,
  UserSigner,
  ProxyProvider,
  Account,
} = require("@elrondnetwork/erdjs");

module.exports = async (context) => {
  try {
    const rawResponse = context.response.getBody();
    const response = JSON.parse(rawResponse.toString('utf-8'));

    const proxyUrl = context.request.getEnvironmentVariable('proxyUrl');
    const mnemonic = context.request.getEnvironmentVariable('mnemonic');

    try {
      const secretKey = Mnemonic.fromString(mnemonic).deriveKey();
      const address = secretKey.generatePublicKey().toAddress();
      const signer = new UserSigner(secretKey);
      const provider = new ProxyProvider(proxyUrl, { timeout: 10000 });
      const account = new Account(address);

      await account.sync(provider);

      const transaction = new Transaction({
        nonce: new Nonce(response.nonce),
        value: Balance.fromString(response.value),
        receiver: new Address(response.receiver),
        gasPrice: new GasPrice(response.gasPrice),
        gasLimit: new GasLimit(response.gasLimit),
        data: new TransactionPayload(Buffer.from(response.data, 'base64')),
        chainID: new ChainID(response.chainID),
        version: new TransactionVersion(response.version),
      });

      transaction.setNonce(account.nonce);

      await signer.sign(transaction);

      response.sender = address.bech32();
      response.signature = transaction.getSignature().hex();
    } catch (error) {
      console.log(error);
    }

    const finalResponse = Buffer.from(JSON.stringify(response), 'utf-8');
    context.response.setBody(finalResponse);
  } catch {
    // no-op
  }
};