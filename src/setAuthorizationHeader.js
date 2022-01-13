module.exports = async (context) => {
  if (context.request.hasHeader('Authorization')) {
    console.log('[header] Skip setting default header. Already set.');
    return;
  }
  try {
    const jwt = "jwt-1";
    context.request.setHeader('Authorization', `Bearer ${jwt}`);
    console.log(`[header] Set Authorization header: Bearer ${jwt}`);
  } catch {
    // no-op
  }
};
