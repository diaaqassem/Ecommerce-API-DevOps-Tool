/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getUserWishList,
  removeFromWishlist,
} = require("../services/wishListService.js");
const { protect, restrictTo } = require("../services/authService.js");
const {
  addToWishListValidator,
} = require("../utils/validators/wishListValidator.js");

router.use(protect, restrictTo("user"));

router
  .route("/")
  .get(getUserWishList)
  .post(addToWishListValidator, addToWishlist);
router.route("/:id").delete(removeFromWishlist);

module.exports = router;
