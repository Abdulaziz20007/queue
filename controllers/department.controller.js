const { errorHandler } = require("../helpers/error_handler");
const Department = require("../schema/Department");
const DepartmentValidation = require("../validations/Department");

const getAll = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).send(departments);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    res.status(200).send({ message: "Done", department });
  } catch (error) {
    errorHandler(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = DepartmentValidation.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const department = await Department.create(value);
    res.status(201).send({ message: "Done", department });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateById = async (req, res) => {
  try {
    const { error, value } = DepartmentValidation.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const department = await Department.findByIdAndUpdate(req.params.id, value);
    res.status(200).send({ message: "Done", department });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Done", department });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { getAll, getById, create, updateById, deleteById };
