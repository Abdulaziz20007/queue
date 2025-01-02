const Joi = require("joi");

const AdminValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z]+$/)
    .required(),

  surname: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z]+$/)
    .required(),

  login: Joi.string().required(),

  password: Joi.string().min(6).max(30).required(),

  role: Joi.string().valid("admin", "super_admin").default("admin"),
});

module.exports = AdminValidation;
