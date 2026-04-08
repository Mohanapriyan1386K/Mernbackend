const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controller/order.controller");

router.post("/addorder", authMiddleware, createOrder);
router.get("/getorders", authMiddleware, getOrders);
router.put("/updateorder/:id", authMiddleware, updateOrder);
router.delete("/deleteorder/:id", authMiddleware, deleteOrder);

module.exports = router;
