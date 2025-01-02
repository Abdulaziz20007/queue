const joi = require("joi");

const ServiceValidation = joi.object({
  name: joi.string().min(3).max(30).required(),
  description: joi.string().min(3).max(30).required(),
  department: joi.string().required(),
  average_service_time: joi.number().required(),
});

module.exports = ServiceValidation;

