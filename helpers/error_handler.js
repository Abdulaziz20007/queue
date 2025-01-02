const errorHandler = (err, res) => {
  return res.status(400).send({ error: err.message });
};

module.exports = { errorHandler };
