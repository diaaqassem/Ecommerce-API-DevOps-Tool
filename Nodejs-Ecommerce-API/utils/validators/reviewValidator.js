/* eslint-disable eqeqeq */
/* eslint-disable prefer-promise-reject-errors */
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Review = require("../../models/reviewModel");

exports.getReviewIDValidator = [
  check("id").isMongoId().withMessage("invalid Review id"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title")
    .isLength({ min: 2, max: 32 })
    .withMessage("Review name must be at least 2 , max:32 characters long"),
  check("ratings")
    .notEmpty()
    .withMessage("Rating is required!")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Invalid rating"),
  check("user")
    .notEmpty()
    .withMessage("User field is required!")
    .isMongoId()
    .withMessage("Invalid user id ")
    .custom(async (user) => {
      await User.findById(user).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("No user with such email");
        }
      });
    }),
  check("product")
    .notEmpty()
    .withMessage("product field is required!")
    .isMongoId()
    .withMessage("Invalid product id ")
    .custom(async (product, { req }) => {
      await Product.findById(product).then((productDoc) => {
        if (!productDoc) {
          return Promise.reject("No product with such id");
        }
      });
      //  check if logged user create review before
      const reviews = await Review.find({
        user: req.body.user,
        product: product,
      });
      if (reviews && reviews.length > 0) {
        return Promise.reject("You already added a review for this product");
      }
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id")
    .custom(async (val, { req }) => {
      await Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject("No review with that id");
        }
        // eslint-disable-next-line no-else-return
        else if (review.user._id.toString() != req.user._id.toString()) {
          return Promise.reject("This is not your review ");
        }
        return true;
      });
    }),
  check("title")
    .optional()
    .isLength({ min: 2, max: 32 })
    .withMessage("Review name must be at least 2 , max:32 characters long"),
  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Invalid rating"),
  check("user")
    .optional()
    .isMongoId()
    .withMessage("Invalid user id ")
    .custom(async (user) => {
      await User.findById(user).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("No user with such email");
        }
      });
    }),
  check("product")
    .optional()
    .isMongoId()
    .withMessage("Invalid product id ")
    .custom(async (product, { req }) => {
      await Product.findById(product).then((productDoc) => {
        if (!productDoc) {
          return Promise.reject("No product with such id");
        }
      });
      //  check if logged user create review before
      const reviews = await Review.find({
        user: req.body.user,
        product: product,
      });
      if (reviews && reviews.length > 0) {
        return Promise.reject("You already added a review for this product");
      }
    }),
  validatorMiddleware,
];

exports.delReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id")
    .custom(async (val, { req }) => {
      await Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject("No review with that id");
        }
        // eslint-disable-next-line no-else-return
        else if (review.user._id.toString() != req.user._id.toString()) {
          return Promise.reject("This is not your review ");
        }
        return true;
      });
    }),
  validatorMiddleware,
];
