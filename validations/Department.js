const joi = require("joi");

const DepartmentValidation = joi.object({
  name: joi.string().min(3).max(30).required(),
  description: joi.string().min(3).max(30).required(),
  letter: joi.string().min(1).max(1).required(),
});

module.exports = DepartmentValidation;
