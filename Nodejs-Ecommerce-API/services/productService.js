const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const { uploadMixImages } = require("../middlewares/uploadImageMiddleware");

module.exports = {
  //  @desc upload images
  uploadProductImages: uploadMixImages("imageCover", "images"),

  resizeProductImages: asyncHandler(async (req, res, next) => {
    // console.log(req.files);
    //  @desc image processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`./uploads/products/${imageCoverFilename}`);

      //  @desc   save image in db
      req.body.imageCover = imageCoverFilename;
    }

    //  @desc image processing for images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (file, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`./uploads/products/${imageName}`);

          //  @desc   save image in db
          req.body.images.push(imageName);
        })
      );
    }
    // console.log(req.body.imageCover);
    // console.log(req.body.images);
    next();
  }),

  //  @desc        Create  new Product
  //  @route       POST /api/products/
  //  @access      Private (for admin,manager)
  newProduct: createOne(Product),

  //  @desc         Get all produts
  //  @route        GET /api/products/
  //  @access       Public
  getProduct: getAll(Product, "Products"),

  //  @ desc     Get specific Product by id
  //  @route      GET /api/products/:id
  //  @access     Public
  getProductById: getOne(Product,'reviews'),

  //  @ desc     Update specific Product by id
  //  @route      PUT /api/products/:id
  //  @access     private (for  admin ,manager)
  updateProduct: updateOne(Product),

  //  @ desc     remove Product by id
  //  @route      DELETE /api/products/:id
  //  @access     private (for  admin only)
  deleteProduct: deleteOne(Product),
};
