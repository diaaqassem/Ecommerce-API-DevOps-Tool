/* eslint-disable prefer-promise-reject-errors */
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");
const { Coupon } = require("../../models/couponModel");

exports.getCouponIDValidator = [
  check("id").isMongoId().withMessage("invalid Coupon id"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("Coupon name must be at least 2 , max:32 characters long")
    .custom(async (val) => {
      await Coupon.findOne({ name: val }).then((result) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (result) return Promise.reject("This coupon already exists");
      });
      return true;
    }),
  check("discount").notEmpty().withMessage("discount is required").isNumeric(),
  check("expire")
    .notEmpty()
    .withMessage("expire date is required")
    .isDate()
    .custom((val) => {
      // check if vlaue date is less than date now
      const d1 = new Date();
      const d2 = new Date(val);
      if (d2 < d1) return Promise.reject("Expiration date can not be in past!");
      return true;
    }),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("name")
    .optional()
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("Coupon name must be at least 2 , max:32 characters long")
    .custom(async (val) => {
      await Coupon.findOne({ name: val }).then((result) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (result) return Promise.reject("This coupon already exists");
      });
      return true;
    }),
  check("discount").optional().isNumeric(),
  check("expire").optional().isDate(),
  validatorMiddleware,
];

exports.delCouponValidator = [...this.getCouponIDValidator];
