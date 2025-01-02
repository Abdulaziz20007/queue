const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  login,
  logout,
  updateById,
  deleteById,
} = require("../controllers/admin.controller");
const adminPolice = require("../polices/admin_police");

router.post("/login", login);

router.get("/", adminPolice, getAll);
router.get("/:id", adminPolice, getById);
router.post("/", create);
router.put("/:id", adminPolice, updateById);
router.delete("/:id", adminPolice, deleteById);
router.post("/logout", adminPolice, logout);

module.exports = router;
