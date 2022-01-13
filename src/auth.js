const axios = require("axios");
const { Mnemonic, UserSigner, SignableMessage } = require("@elrondnetwork/erdjs");

const getLoginTokenFromMaiarId = async (maiarIdUrl) => {
  const { data } = await axios.post(`${maiarIdUrl}/login/init`, {});
  return data.loginToken;
}

const getJwtFromMaiarId = async (maiarIdUrl, loginToken, mnemonic) => {
  try {
    const secretKey = Mnemonic.fromString(mnemonic).deriveKey();
    const address = secretKey.generatePublicKey().toAddress().bech32();
    const signer = new UserSigner(secretKey);
    const messageToSign = address + loginToken + JSON.stringify({});
    const message = new SignableMessage({
      message: Buffer.from(messageToSign)
    });
    await signer.sign(message);

    const { data } = await axios.post(`${maiarIdUrl}/login`, {
      address,
      loginToken,
      signature: message.getSignature().hex(),
      data: {}
    });

    return data.accessToken;
  } catch (err) {
    return err;
  }
}

const getJwt = async (maiarIdUrl, mnemonic) => {
  const loginToken = await getLoginTokenFromMaiarId(maiarIdUrl);
  return await getJwtFromMaiarId(maiarIdUrl, loginToken, mnemonic);
};

module.exports = {
  getJwt
};
