const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} = require("../controllers/queue.controller");
const customerPolice = require("../polices/customer_police");
const adminPolice = require("../polices/admin_police");
router.get("/", getAll);
router.get("/:id", getById);

router.post("/", customerPolice, create);
router.put("/:id", adminPolice, updateById);
router.delete("/:id", [customerPolice, adminPolice], deleteById);

module.exports = router;
