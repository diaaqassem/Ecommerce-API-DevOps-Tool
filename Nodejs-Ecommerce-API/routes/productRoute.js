/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  newProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../services/productService.js");
const {
  getProductIDValidator,
  createProductValidator,
  updateProductValidator,
  delProductValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/productValidator.js");
const {
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
const { protect, restrictTo } = require("../services/authService.js");

const reviewRoute = require(`./reviewRoute.js`);

router
  .route("/")
  .get(getProduct)
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    newProduct
  );
router
  .route("/:id")
  .get(getProductIDValidator, getProductById)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, restrictTo("admin"), delProductValidator, deleteProduct);

//nested route

router.use("/:productId/reviews", reviewRoute);

module.exports = router;
