const express = require("express");
const router = express.Router();

const customerRoutes = require("./customer.routes");
const operatorRoutes = require("./operator.routes");
const departmentRoutes = require("./department.routes");
const serviceRoutes = require("./service.routes");
const queueRoutes = require("./queue.routes");
const adminRoutes = require("./admin.routes");

router.use("/customer", customerRoutes);
router.use("/operator", operatorRoutes);
router.use("/department", departmentRoutes);
router.use("/service", serviceRoutes);
router.use("/queue", queueRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
