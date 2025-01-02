const joi = require("joi");

const OperatorValidation = joi.object({
  name: joi.string().min(3).max(30).required(),
  surname: joi.string().min(3).max(30).required(),
  login: joi.string().min(3).max(30).required(),
  password: joi.string().min(8).max(30).required(),
  department: joi.string().required(),
});

module.exports = OperatorValidation;
