/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  createCashOrder,
  getOrders,
  getOrder,
  getAllOrders,
  filterObjForLoggedUser,
  updateOrderPaidStatus,
  updateOrderDeliveredStatus,
  deleteOrder,
  checkoutSession,
} = require("../services/orderService.js");
const { protect, restrictTo } = require("../services/authService.js");

router.put(
  "/:id/paid",
  protect,
  restrictTo("admin", "manager"),
  updateOrderPaidStatus
);
router.put(
  "/:id/delivered",
  protect,
  restrictTo("admin", "manager"),
  updateOrderDeliveredStatus
);

router.use(protect, restrictTo("user"));

// stripe
router.post("/checkout-session", checkoutSession);
router
  .route("/")
  .post(createCashOrder)
  .get(
    filterObjForLoggedUser,
    restrictTo("admin", "manager", "user"),
    getAllOrders
  );
router.get("/:id", getOrder);
// router.delete("/:id/canceled", deleteOrder);

module.exports = router;
