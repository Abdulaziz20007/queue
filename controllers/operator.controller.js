const Operator = require("../schema/Operator");
const OperatorValidation = require("../validations/Operator");
const bcrypt = require("bcrypt");
const config = require("config");
const { errorHandler } = require("../helpers/error_handler");

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

module.exports = { getAll, getById, create, updateById, deleteById };
