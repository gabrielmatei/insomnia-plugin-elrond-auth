const { getJwt } = require('./auth');

module.exports = async (context) => {
  if (context.request.hasHeader('Authorization')) {
    console.log('[header] Skip setting default header. Already set.');
    return;
  }
  try {
    const maiarIdUrl = context.request.getEnvironmentVariable('maiarIdUrl');
    const mnemonic = context.request.getEnvironmentVariable('mnemonic');

    const jwt = await getJwt(maiarIdUrl, mnemonic);

    context.request.setHeader('Authorization', `Bearer ${jwt}`);
    console.log(`[header] Set Authorization header: Bearer ${jwt}`);
  } catch {
    // no-op
  }
};
