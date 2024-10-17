const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");
const Product = require("../../models/productModel");

exports.addToWishListValidator = [
  check("productId")
    .isMongoId()
    .withMessage("invalid product id")
    .custom(async (val) => {
      await Product.findById(val).then((product) => {
        if (!product) {
          throw new Error("Product does not exist");
        }
        return true;
      });
    }),
  validatorMiddleware,
];
