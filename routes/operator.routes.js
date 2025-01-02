const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} = require("../controllers/operator.controller");
const adminPolice = require("../polices/admin_police");
const operatorPolice = require("../polices/operator_police");
const operatorSelfPolice = require("../polices/operator_self_police");

router.get("/", [adminPolice, operatorPolice], getAll);
router.get("/:id", [adminPolice, operatorSelfPolice], getById);
router.post("/", adminPolice, create);
router.put("/:id", [adminPolice, operatorSelfPolice], updateById);
router.delete("/:id", [adminPolice, operatorSelfPolice], deleteById);

module.exports = router;
