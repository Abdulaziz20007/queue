const express = require("express");
const router = express.Router();
const {
  create,
  login,
  verify,
  resendVerification,
  getAll,
  getById,
  update,
  deleteCustomer,
  logout,
  refreshToken,
} = require("../controllers/customer.controller");
const adminPolice = require("../polices/admin_police");
const customerSelfPolice = require("../polices/customer_self_police");

router.post("/register", create);
router.post("/login", login);
router.get("/verify/:verification", verify);
router.post("/resend", resendVerification);

router.get("/", adminPolice, getAll);
router.get("/:id", customerSelfPolice, getById);
router.put("/:id", customerSelfPolice, update);
router.delete("/:id", customerSelfPolice, deleteCustomer);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

module.exports = router;
