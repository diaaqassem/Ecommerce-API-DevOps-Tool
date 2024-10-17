// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  //  @DESC      diskstorage engine  for handling file uploads
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "./uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     if (file) {
  //       //   console.log("file : ", file);
  //       const ext = file.mimetype.split("/")[1];
  //       const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //       cb(null, fileName);
  //     } else {
  //       console.log("No image selected!");
  //       cb(new ApiError("Please select an image",400), false);
  //     }
  //   },
  // });
  //  @desc     memory storage engine (return buffer)
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new ApiError("Not a valid  image!", 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  return upload;
};

//  @desc single image
const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

//  @desc upload multible images
const uploadMixImages = (singleImg, multiImg) =>
  multerOptions().fields([
    { name: singleImg, maxCount: 1 },
    { name: multiImg, maxCount: 5 },
  ]);

module.exports = {
  uploadSingleImage,
  uploadMixImages,
};
