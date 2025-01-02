const { verifyAccessToken } = require("../service/jwt_service");
const { errorHandler } = require("../helpers/error_handler");

const customerSelfPolice = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: "Token topilmadi" });
    }

    const accessToken = token.split(" ")[1];
    if (!accessToken) {
      return res.status(401).send({ message: "Noto'g'ri token" });
    }

    const decodedToken = verifyAccessToken(accessToken);
    if (!decodedToken) {
      return res.status(401).send({ message: "Token yaroqsiz" });
    }

    if (req.params.id && req.params.id !== decodedToken.id) {
      return res.status(403).send({ message: "Ruxsat yo'q" });
    }

    req.customer = decodedToken;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = customerSelfPolice;
