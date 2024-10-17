const SubCategory = require("../models/subCategoryModel");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlersFactory");

module.exports = {
  setCategoryIdToBody: (req, res, next) => {
    //  @desc apply nested route middleware to add category id to req.body

    //  @desc apply nested route
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
  },

  createFilterObj: (req, re, next) => {
    //  @desc apply nested route (get route)
    const { categoryId } = req.params;
    let filterObj = {};
    if (categoryId) {
      filterObj = { category: categoryId };
      req.filterObj = filterObj;
      next();
    } else next();
  },
  /**
   * Create a new sub category
   */
  //  @desc        Create  new Subcategory
  //  @route       POST /api/subCategories/
  //  @access      Private (for admin)
  createSubCategory:createOne(SubCategory),

  /**
   *   Get all sub categories
   *   // nested route
   *   @description Get /api/categories/:categoryId/subCategories
   *   @queryParam sortBy - to sort the subcategories by createdAt or updatedAt (optional)
   *   @queryParam limit - max number of docs to return (optional)
   *   @queryParam page - current page (optional)
   */
  getAllSubCategories: getAll(SubCategory,"SubCategories"),

  //  @ desc     Get specific Subcategory by id
  //  @route      GET /api/categories/:id
  //  @access     Public
  getSubCategoryById: getOne(SubCategory),

  //  @ desc     Update specific Subcategory by id
  //  @route      PUT /api/categories/:id
  //  @access     private (for  admin only)
  updateSubcategory: updateOne(SubCategory),

  //  @ desc     remove Subcategory by id
  //  @route      DELETE /api/categories/:id
  //  @access     private (for  admin only)
  deleteSubcategory: deleteOne(SubCategory),
};
