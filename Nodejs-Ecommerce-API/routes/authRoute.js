/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgetPassword,
  verifyPasswordReset,
  resetPassword,
} = require("../services/authService.js");
const {
  signupValidator,
  loginValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/authValidator.js");

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgetPassword);
router.post("/verifyResetCode", verifyPasswordReset);
router.put("/resetPassword", resetPassword);

module.exports = router;
