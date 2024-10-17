const express = require("express");
//  merge => allow to access params on other routers
//  ex: need to access categoryId from category router
const router = express.Router({ mergeParams: true });
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryIDValidator,
  updateSubCategoryValidator,
  delSubCatValidator,
} = require("../utils/validators/subCategoryValidator");
const { protect, restrictTo } = require("../services/authService");

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getAllSubCategories);
router
  .route("/:id")
  .get(getSubCategoryIDValidator, getSubCategoryById)
  .put(
    protect,
    restrictTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubcategory
  )
  .delete(protect, restrictTo("admin"), delSubCatValidator, deleteSubcategory);

module.exports = router;
