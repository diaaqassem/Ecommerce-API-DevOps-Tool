/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");

const router = express.Router();
const {
  newCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../services/categoryService.js");
const {
  getCategoryIDValidator,
  createCategoryValidator,
  updateCategoryValidator,
  delCatValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/categoryValidator.js");
const subCategoryRoute = require("./subCategoryRoute.js");
const { protect, restrictTo } = require("../services/authService.js");

router
  .route("/")
  .get(getCategory)
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    newCategory
  );
router
  .route("/:id")
  .get(getCategoryIDValidator, getCategoryById)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protect,
    restrictTo("admin"),
    delCatValidator,
    deleteCategory
  );

router.use("/:categoryId/subCategories", subCategoryRoute);

module.exports = router;
