/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  newBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
  getBrands,
  uploadBrandImage,
  resizeBrandImage,
} = require("../services/brandService.js");
const {
  getBrandIDValidator,
  createBrandValidator,
  updateBrandValidator,
  delBrandValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/brandValidator.js");
const { protect, restrictTo } = require("../services/authService.js");

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    newBrand
  );
router
  .route("/:id")
  .get(getBrandIDValidator, getBrandById)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, restrictTo("admin"), delBrandValidator, deleteBrand);

module.exports = router;
