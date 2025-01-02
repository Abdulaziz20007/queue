const { verifyAccessToken } = require("../service/jwt_service");
const Customer = require("../schema/Customer");

const customerPolice = async (req, res, next) => {
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

    const customer = await Customer.findById(decodedToken.id);
    if (!customer || !customer.is_active) {
      return res.status(403).send({ message: "Mijoz topilmadi yoki aktiv emas" });
    }

    req.customer = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Autentifikatsiya muvaffaqiyatsiz",
      error: error.message,
    });
  }
};

module.exports = customerPolice;
