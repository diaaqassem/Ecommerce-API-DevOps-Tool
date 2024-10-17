const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");

exports.addToAddressesValidator = [
  check("alias")
    .notEmpty()
    .withMessage("alias is requred")
    .custom(async (val, { req }) => {
      if (req.user.addresses.some((addr) => addr.alias === val))
        throw new Error("Alias must be unique.");
      return true;
    }),
  check("city").notEmpty().withMessage("city is required"),
  check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number Only Accepted EG And SA numbers!"),
  check("postalCode").optional(),
  validatorMiddleware,
];
