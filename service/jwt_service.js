const jwt = require("jsonwebtoken");
const config = require("config");

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, config.get("jwt_secret"), {
    expiresIn: config.get("jwt_access_token_time"),
  });
  const refreshToken = jwt.sign(payload, config.get("jwt_secret"), {
    expiresIn: config.get("jwt_refresh_token_time"), 
  });
  return { tokens: { accessToken, refreshToken } };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.get("jwt_secret"));
};

module.exports = { generateTokens, verifyAccessToken };
