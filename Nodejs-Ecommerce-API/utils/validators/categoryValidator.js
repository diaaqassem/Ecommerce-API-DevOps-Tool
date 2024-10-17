const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");

exports.getCategoryIDValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required")
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("category name must be at least 2 , max:32 characters long"),
  // check("image").notEmpty().withMessage("category image is required"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  check("name")
    .optional()
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("category name must be at least 2 , max:32 characters long"),
  // check("image").notEmpty().withMessage("category image is required"),
  validatorMiddleware,
];

exports.delCatValidator = [...this.getCategoryIDValidator];
