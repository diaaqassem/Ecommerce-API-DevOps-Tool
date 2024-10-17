const jwt = require("jsonwebtoken");

module.exports = {
  generateJWT: (payload) => {
    const token = jwt.sign({ id: payload._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  },
};
