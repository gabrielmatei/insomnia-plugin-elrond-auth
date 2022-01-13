module.exports = async (context) => {
  try {
    const rawResponse = context.response.getBody();
    const response = JSON.parse(rawResponse.toString('utf-8'));

    response.signature = "sig";

    const finalResponse = Buffer.from(JSON.stringify(response), 'utf-8');
    context.response.setBody(finalResponse);
  } catch {
    // no-op
  }
};