const { verifyAccessToken } = require("../service/jwt_service");
const Operator = require("../schema/Operator");

const operatorPolice = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Token topilmadi" });
    }

    const accessToken = token.split(" ")[1];
    const decodedToken = verifyAccessToken(accessToken);

    if (!decodedToken) {
      return res.status(403).send({ message: "Token yaroqsiz" });
    }

    const operator = await Operator.findById(decodedToken.id);
    if (!operator) {
      return res.status(403).send({ message: "Operator topilmadi" });
    }
    req.operator = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Autentifikatsiya muvaffaqiyatsiz",
      error: error.message,
    });
  }
};

module.exports = operatorPolice;
