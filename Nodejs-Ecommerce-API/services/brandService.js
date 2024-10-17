const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
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
  uploadBrandImage: uploadSingleImage("img"),

  //  @desc       resize image
  resizeBrandImage: expressAsyncHandler(async (req, res, next) => {
    // console.log(req.file);
    if (!req.file) return next();
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`./uploads/brands/${filename}`);

    //  @desc   save image in db
    req.body.img = filename;

    next();
  }),

  //  @desc        Create  new Brand
  //  @route       POST /api/brands/
  //  @access      Private (for admin,manager)
  newBrand: createOne(Brand),

  //  @desc         Get all Categories
  //  @route        GET /api/brands/
  //  @access       Public
  getBrands: getAll(Brand, "Brands"),

  //  @ desc     Get specific Brand by id
  //  @route      GET /api/brands/:id
  //  @access     Public
  getBrandById: getOne(Brand),

  //  @ desc     Update specific Brand by id
  //  @route      PUT /api/brands/:id
  //  @access     private (for  admin ,manager)
  updateBrand: updateOne(Brand),

  //  @ desc     remove Brand by id
  //  @route      DELETE /api/brands/:id
  //  @access     private (for  admin only)
  deleteBrand: deleteOne(Brand),
};
