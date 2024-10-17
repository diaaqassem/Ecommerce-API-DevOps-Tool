const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subcategory name is required")
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage(
      "subcategory name must be at least 2 , max:32 characters long"
    ),
  check("category").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];

exports.getSubCategoryIDValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id"),
  check("name")
    .notEmpty()
    .withMessage("subcategory name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage(
      "subcategory name must be at least 2 , max:32 characters long"
    ),
  validatorMiddleware,
];

exports.delSubCatValidator = [...this.getSubCategoryIDValidator];
