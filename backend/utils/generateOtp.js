const generateOtp = () => {
  // 6 digit numeric OTP, valid for 10 minutes
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return { code, expiresAt };
};

module.exports = generateOtp;
