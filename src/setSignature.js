module.exports = async (context) => {
  try {
    const rawResponse = context.response.getBody();
    const response = JSON.parse(rawResponse.toString('utf-8'));

    const maiarIdUrl = context.request.getEnvironmentVariable('maiarIdUrl');
    const mnemonic = context.request.getEnvironmentVariable('mnemonic');

    const signature = "";
    response.signature = signature;

    const finalResponse = Buffer.from(JSON.stringify(response), 'utf-8');
    context.response.setBody(finalResponse);
  } catch {
    // no-op
  }
};