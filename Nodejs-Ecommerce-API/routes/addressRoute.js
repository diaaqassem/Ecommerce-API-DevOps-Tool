/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  addToAddresses,
  getUserAddresses,
  removeFromAddresses,
} = require("../services/addressService.js");
const { protect, restrictTo } = require("../services/authService.js");
const { addToAddressesValidator } = require("../utils/validators/addressValidator.js");

router.use(protect, restrictTo("user"));

router.route("/").get(getUserAddresses).post(
  addToAddressesValidator,
  addToAddresses
);

router.route("/:id").delete(removeFromAddresses);

module.exports = router;
