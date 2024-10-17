const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  updateCartQuantity,
  applyCoupon,
} = require("../services/cartService.js");
const { protect, restrictTo } = require("../services/authService.js");
const { createCartValidator } = require("../utils/validators/cartValidator.js");

router.use(protect, restrictTo("user"));

router
  .route("/")
  .post(createCartValidator, addToCart)
  .get(getCartItems)
  .delete(clearCart);
router.route("/:id").delete(removeFromCart).put(updateCartQuantity);
router.post("/applyCoupon", applyCoupon);

module.exports = router;
