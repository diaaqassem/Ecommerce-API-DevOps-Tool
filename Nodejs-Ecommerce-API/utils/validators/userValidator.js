const bcrypt = require("bcryptjs");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");
const User = require("../../models/userModel");

exports.getUserIDValidator = [
  check("id").isMongoId().withMessage("invalid user id"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name is required")
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("user name must be at least 2 , max:32 characters long"),
  check("email")
    .notEmpty()
    .withMessage("user email is required")
    .isEmail()
    .withMessage("invalid E-mail")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("E-mail already in use please Try Again");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("user password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long")
    .custom((password, { req }) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(password)) {
        // eslint-disable-next-line no-new
        throw new Error(
          `Password should contain atleast one uppercase letter, one lower case letter, one numeric digit and one special character`
        );
      }
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password does not meet requirements");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("confirm password is required"),
  check("profileImg").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number Only Accepted EG And SA numbers!"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id"),
  check("name")
    .optional()
    .bail() // stop on the first error
    .isLength({ min: 2, max: 32 })
    .withMessage("user name must be at least 2 , max:32 characters long"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid E-mail")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("E-mail already in use please Try Again");
      }
      return true;
    }),
  check("profileImg").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number Only Accepted EG And SA numbers!"),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required"),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long")
    .custom(async (password, { req }) => {
      const user = await User.findById({ _id: req.params.id });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isMatch) {
        throw new Error("current password is incorrect");
      }
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(password)) {
        // eslint-disable-next-line no-new
        throw new Error(
          `Password should contain atleast one uppercase letter, one lower case letter, one numeric digit and one special character`
        );
      }
      if (password !== req.body.passwordConfirm) {
        throw new Error(" Password does not meet requirements");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.delUserValidator = [...this.getUserIDValidator];
