/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
// access params from parent route
const router = express.Router({ mergeParams: true });
const {
  newReview,
  getReviewById,
  updateReview,
  deleteReview,
  getReviews,
  // createFilterObj,
  setProductIdToBody,
} = require("../services/reviewService.js");
const {
  getReviewIDValidator,
  createReviewValidator,
  updateReviewValidator,
  delReviewValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/reviewValidator.js");
const { protect, restrictTo } = require("../services/authService.js");

router
  .route("/")
  .get(
    // createFilterObj,
     getReviews)
  .post(
    protect,
    restrictTo("user"),
    setProductIdToBody,
    createReviewValidator,
    newReview
  );
router
  .route("/:id")
  .get(getReviewIDValidator, getReviewById)
  .put(protect, restrictTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    restrictTo("admin", "user", "manager"),
    delReviewValidator,
    deleteReview
  );

module.exports = router;
