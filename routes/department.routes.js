const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} = require("../controllers/department.controller");
const adminPolice = require("../polices/admin_police");

router.get("/", getAll);
router.get("/:id", getById);

router.use(adminPolice);
router.post("/", create);
router.put("/:id", updateById);
router.delete("/:id", deleteById);

module.exports = router;
