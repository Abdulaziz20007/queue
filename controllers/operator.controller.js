const Operator = require("../schema/Operator");
const OperatorValidation = require("../validations/Operator");
const bcrypt = require("bcrypt");
const config = require("config");
const { errorHandler } = require("../helpers/error_handler");
const { generateTokens } = require("../service/jwt_service");

const getAll = async (req, res) => {
  try {
    const operators = await Operator.find()
      .select("-password")
      .populate("department", ["name", "description", "letter"]);
    res.status(200).send({ message: "Done", operators });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id).select("-password");
    res.status(200).send({ message: "Done", operator });
  } catch (error) {
    errorHandler(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = OperatorValidation.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const operator = await Operator.create({
      ...value,
      password: bcrypt.hashSync(value.password, config.get("bcrypt_round")),
    });

    const operatorResponse = operator.toObject();
    delete operatorResponse.password;

    res.status(201).send({ message: "Done", operator: operatorResponse });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateById = async (req, res) => {
  try {
    const { error, value } = OperatorValidation.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const operator = await Operator.findByIdAndUpdate(req.params.id, value);
    res.status(200).send({ message: "Done", operator });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const operator = await Operator.findByIdAndDelete(req.params.id).select(
      "-password"
    );
    res.status(200).send({ message: "Done", operator });
  } catch (error) {
    errorHandler(error, res);
  }
};

const login = async (req, res) => {
  try {
    const operator = await Operator.findOne({ login: req.body.login });
    if (!operator)
      return res.status(400).send({ message: "Operator topilmadi" });

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      operator.password
    );
    if (!isPasswordCorrect)
      return res.status(400).send({ message: "Login yoki parol noto'g'ri" });

    const tokens = generateTokens(
      operator._id,
      operator.name,
      operator.surname,
      operator.login,
      operator.department
    );

    res.cookie("operatorRefreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("jwt_refresh_token_time"),
    });

    await Operator.findByIdAndUpdate(operator._id, {
      $set: { refreshToken: tokens.refreshToken },
    });

    res
      .status(200)
      .send({ message: "Done", operatorAccessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logout = async (req, res) => {
  try {
    await Operator.findByIdAndUpdate(req.operator._id, {
      $set: { refreshToken: "" },
    });

    res.clearCookie("operatorRefreshToken");
    res.status(200).send({ message: "Done" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.operatorRefreshToken;
    if (!refreshToken)
      return res.status(400).send({ message: "Refresh token topilmadi" });

    const operator = await Operator.findById(refreshToken);
    if (!operator)
      return res.status(400).send({ message: "Operator topilmadi" });

    const tokens = generateTokens(
      operator._id,
      operator.name,
      operator.surname,
      operator.login,
      operator.department
    );
    res.cookie("operatorRefreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("jwt_refresh_token_time"),
    });

    await Operator.findByIdAndUpdate(operator._id, {
      $set: { refreshToken: tokens.refreshToken },
    });

    res
      .status(200)
      .send({ message: "Done", operatorAccessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  login,
  logout,
  refreshToken,
};
