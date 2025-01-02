const joi = require("joi");

const CustomerValidation = joi.object({
  name: joi.string().min(3).max(30).required(),
  surname: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  phone: joi
    .string()
    .regex(/^(9[0-9]|3[3-7]|7[1-5]|88)\s?\d{3}\s?\d{2}\s?\d{2}$/)
    .required(),
  password: joi.string().min(8).max(30).required(),
});

module.exports = CustomerValidation;
