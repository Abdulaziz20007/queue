const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} = require("../controllers/service.controller");
const adminPolice = require("../polices/admin_police");

router.get("/", getAll);
router.get("/:id", getById);

router.post("/", adminPolice, create);
router.put("/:id", adminPolice, updateById);
router.delete("/:id", adminPolice, deleteById);

module.exports = router;
