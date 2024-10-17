const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");

exports.getBrandIDValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name is required")
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("brand name must be at least 2 , max:32 characters long"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  check("name")
    .optional()
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("brand name must be at least 2 , max:32 characters long"),
  validatorMiddleware,
];

exports.delBrandValidator = [...this.getBrandIDValidator];
