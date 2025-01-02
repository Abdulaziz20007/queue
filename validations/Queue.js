const joi = require("joi");

const QueueValidation = joi.object({
  service: joi.string().required(),
});

module.exports = QueueValidation;
