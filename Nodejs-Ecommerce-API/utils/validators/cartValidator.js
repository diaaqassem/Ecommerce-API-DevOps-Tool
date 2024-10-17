/* eslint-disable prefer-promise-reject-errors */
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");
const Product = require("../../models/productModel");

exports.createCartValidator = [
  check("product")
    .isMongoId()
    .withMessage(" invalid productId")
    .notEmpty()
    .withMessage("product is required")
    .custom(async (val) => {
      await Product.findOne({ _id: val }).then((result) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (!result) return Promise.reject("Product does not exist");
      });
      return true;
    }),
  check("color")
    .notEmpty()
    .withMessage("product color is required")
    .custom(async (val, { req }) => {
      await Product.findOne({ _id: req.body.product }).then((result) => {
        // check if color is found in product color
        if (!result.colors.includes(val)) {
          return Promise.reject("Invalid color");
        }
        return true;
      });
    }),
  validatorMiddleware,
];
