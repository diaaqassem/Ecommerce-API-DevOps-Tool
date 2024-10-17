/* eslint-disable no-undef */
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Category = require("../models/categoryModel");
const {
  updateOne,
  deleteOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

module.exports = {
  
  //  @desc        image upload
  uploadCategoryImage: uploadSingleImage("image"),

  //  @desc       resize image
  resizeCategoryImage: asyncHandler(async (req, res, next) => {
    // console.log(req.file);
    if (!req.file) return next();
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`./uploads/categories/${filename}`);

    //  @desc   save image in db
    req.body.image = filename;

    next();
  }),

  //  @desc        Create  new Category
  //  @route       POST /api/categories/
  //  @access      Private (for admin , manager)
  newCategory: createOne(Category),

  //  @desc         Get all Categories
  //  @route        GET /api/categories/
  //  @access       Public
  getCategory: getAll(Category, "Categories"),

  //  @ desc     Get specific Category by id
  //  @route      GET /api/categories/:id
  //  @access     Public
  getCategoryById: getOne(Category),

  //  @ desc     Update specific Category by id
  //  @route      PUT /api/categories/:id
  //  @access     private (for  admin ,manager)
  updateCategory: updateOne(Category),

  //  @ desc     remove Category by id
  //  @route      DELETE /api/categories/:id
  //  @access     private (for  admin only)
  deleteCategory: deleteOne(Category),
};
