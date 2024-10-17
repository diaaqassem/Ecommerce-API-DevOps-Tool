const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
// eslint-disable-next-line import/order
const { check } = require("express-validator");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const Brand = require("../../models/brandModel");

exports.getProductIDValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .isLength({ min: 2 })
    .withMessage("title must be at least 2 characters")
    .notEmpty()
    .withMessage("category name is required"),
  check("description")
    .notEmpty()
    .withMessage("product desciption is required")
    .isLength({ min: 3, max: 3000 })
    .withMessage("category name must be at least 3 , max 3000 characters long"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("sold must be a number"),
  check("price")
    .notEmpty()
    .isNumeric()
    .withMessage("price must be a number and required")
    .isLength({ max: 32 })
    .withMessage("to long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be array of strings"),
  check("imageCover").notEmpty().withMessage("imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to a category")
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("category not found");
      }
      return true;
    }),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("subCategories")
    .optional()
    .isArray()
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (subCategoriesIds) => {
      //  @description : Checking that all subcategories in the request body are related to the main category
      //  @desc return subcategories found in DB
      await SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((results) => {
        // console.log("length", results.length);
        if (results.length !== subCategoriesIds.length) {
          // console.log("length", results.length);
          throw new Error(
            "subcategories are not found in database , check subcategories id "
          );
        }
      });
    })
    .custom(async (vals, { req }) => {
      await SubCategory.find({ category: req.body.category }).then(
        (categorySubs) => {
          const subCategoriesIdsInMongo = []; 
          categorySubs.forEach((subCategory) => {
            subCategoriesIdsInMongo.push(subCategory._id.toString());
          });
          // eslint-disable-next-line array-callback-return
          const checker = vals.every((val) =>
            subCategoriesIdsInMongo.includes(val) // return bool
          );

          // console.log(checker);
          if (!checker) {
            throw new Error(
              "All subcategories must belong to the same category"
            );
          }
        }
      );
    }),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      const brand = await Brand.findById(value);
      if (!brand) {
        return Promise.reject(new Error("brand not found"));
      }
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be numeric value")
    .isFloat()
    .withMessage("ratingsAverage must be a number"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("title")
    .isLength({ min: 2 })
    .withMessage("title must be at least 2 characters")
    .optional(),
  check("description")
    .optional()
    .isLength({ min: 3, max: 3000 })
    .withMessage("category name must be at least 3 , max 3000 characters long"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("sold must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("price must be a number and required")
    .isLength({ max: 32 })
    .withMessage("to long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be array of strings"),
  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("category not found");
      }
      return true;
    }),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("subCategories")
    .optional()
    .isArray()
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (subCategoriesIds) => {
      //  @description : Checking that all subcategories in the request body are related to the main category
      //  @desc return subcategories found in DB
      await SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((results) => {
        // console.log("length", results.length);
        if (results.length !== subCategoriesIds.length) {
          // console.log("length", results.length);
          throw new Error(
            "subcategories are not found in database , check subcategories id "
          );
        }
      });
    })
    .custom(async (vals, { req }) => {
      await SubCategory.find({ category: req.body.category }).then(
        (categorySubs) => {
          const subCategoriesIdsInMongo = []; 
          categorySubs.forEach((subCategory) => {
            subCategoriesIdsInMongo.push(subCategory._id.toString());
          });
          // eslint-disable-next-line array-callback-return
          const checker = vals.every((val) =>
            subCategoriesIdsInMongo.includes(val) // return bool
          );

          // console.log(checker);
          if (!checker) {
            throw new Error(
              "All subcategories must belong to the same category"
            );
          }
        }
      );
    }),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      const brand = await Brand.findById(value);
      if (!brand) {
        return Promise.reject(new Error("brand not found"));
      }
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be numeric value")
    .isFloat()
    .withMessage("ratingsAverage must be a number"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];


exports.delProductValidator = [...this.getProductIDValidator];
