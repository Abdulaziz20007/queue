const Service = require("../schema/Service");
const { errorHandler } = require("../helpers/error_handler");
const ServiceValidation = require("../validations/Service");

const getAll = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).send({ message: "Done", services });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.status(200).send({ message: "Done", service });
  } catch (error) {
    errorHandler(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = ServiceValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const service = await Service.create({
      ...value,
      current_number: 0,
    });
    res.status(201).send({ message: "Done", service });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateById = async (req, res) => {
  try {
    const { error, value } = ServiceValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const service = await Service.findByIdAndUpdate(req.params.id, value);
    res.status(200).send({ message: "Done", service });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Done", service });
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
};
