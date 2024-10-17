/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  newCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getCoupons,
} = require("../services/couponService.js");
const {
  getCouponIDValidator,
  createCouponValidator,
  updateCouponValidator,
  delCouponValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/couponValidator.js");
const { protect, restrictTo } = require("../services/authService.js");

router.use(protect, restrictTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCouponValidator, newCoupon);
router
  .route("/:id")
  .get(getCouponIDValidator, getCouponById)
  .put(updateCouponValidator, updateCoupon)
  .delete(delCouponValidator, deleteCoupon);

module.exports = router;
