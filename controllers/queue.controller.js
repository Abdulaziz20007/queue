const Queue = require("../schema/Queue");
const { errorHandler } = require("../helpers/error_handler");
const QueueValidation = require("../validations/Queue");
const Service = require("../schema/Service");
const getAll = async (req, res) => {
  try {
    const queue = await Queue.find()
      .populate("service", ["name", "description", "department"])
      .populate("department", ["name", "description", "letter"])
      .populate("operator", ["name", "surname", "login", "department"])
      .populate("customer", ["name", "surname", "phone", "email"]);
    res.status(200).send({ message: "Done", queue });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id)
      .populate("service", ["name", "description", "department"])
      .populate("department", ["name", "description", "letter"])
      .populate("operator", ["name", "surname", "login", "department"])
      .populate("customer", ["name", "surname", "phone", "email"]);
    res.status(200).send({ message: "Done", queue });
  } catch (error) {
    errorHandler(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = QueueValidation.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const service = await Service.findOne({ _id: value.service }).populate(
      "department",
      ["letter"]
    );

    if (!service?.department?.letter) {
      return res.status(400).send({ message: "Bo'lim harfi topilmadi" });
    }

    const last = await Queue.findOne({
      service: req.body.service._id,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(24, 0, 0, 0)),
      },
    })
      .sort("-createdAt")
      .select("ticket_number");

    const letter = service.department.letter;
    const num = 1;
    if (last != null) {
      num = +last.ticket_number.slice(1) + 1;
    }

    const queue = await Queue.create({
      ...value,
      ticket_number: `${letter}${num}`,
      customer: req.customer.id,
    });

    res.status(201).send({ message: "Done", queue });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateById = async (req, res) => {
  try {
    const { error, value } = QueueValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const queue = await Queue.findByIdAndUpdate(req.params.id, value);
    res.status(200).send({ message: "Done", queue });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const queue = await Queue.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Done", queue });
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
