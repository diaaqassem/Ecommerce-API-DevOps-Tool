const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { deleteOne, createOne, getOne, getAll } = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");
const { generateJWT } = require("../utils/createToken");

module.exports = {
  //  @desc        image upload
  uploadUserImage: uploadSingleImage("profileImg"),

  //  @desc       resize image
  resizeUserImage: expressAsyncHandler(async (req, res, next) => {
    // console.log(req.file);
    if (!req.file) return next();
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`./uploads/users/${filename}`);

    //  @desc   save image in db
    req.body.profileImg = filename;

    next();
  }),

  //  @desc        Create  new User
  //  @route       POST /api/users/
  //  @access      Private (for admin)
  newUser: createOne(User),

  //  @desc         Get all Categories
  //  @route        GET /api/users/
  //  @access      Private (for admin ,manager)
  getUsers: getAll(User, "Users"),

  //  @ desc     Get specific User by id
  //  @route      GET /api/users/:id
  //  @access      Private (for admin,manager)
  getUserById: getOne(User),

  //  @ desc     Update specific User by id
  //  @route      PUT /api/users/:id
  //  @access      Private (for admin)
  updateUser: expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    const document = await User.findByIdAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        slug: req.body.slug,
        profileImg: req.body.profileImg,
        phone: req.body.phone,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!document) {
      return next(new ApiError("document not found", 404));
    }
    res
      .status(200)
      .json({ success: true, MSG: "document Updated", data: document });
  }),

  //  @ desc     Update specific User password by id
  //  @route      post /api/users/changePassword/:id
  //  @access      Private (for admin)
  changeUserPassword: expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await User.findByIdAndUpdate(
      { _id: id },
      {
        password: await bcrypt.hash(req.body.password, 10),
        passwordChangedAT: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!document) {
      return next(new ApiError("document not found", 404));
    }
    res
      .status(200)
      .json({ success: true, MSG: "document Updated", data: document });
  }),

  //  @ desc     remove User by id
  //  @route      post /api/users/:id
  //  @access      Private (for admin)
  deleteUser: deleteOne(User),

  //  @desc get logged data (as a middleware)
  //  @route      post /api/users/getMe
  //  @access      Private (protect)
  getLoggedUser: expressAsyncHandler((req, res, next) => {
    req.params.id = req.user._id;
    next();
  }),

  //  @desc updatelogged user password
  //  @route      post /api/users/chandeMyPassword
  //  @access      Private (protect)
  changeLoggedUserPassword: expressAsyncHandler(async (req, res, next) => {
    const { _id } = req.user;

    const user = await User.findByIdAndUpdate(
      { _id },
      {
        password: await bcrypt.hash(req.body.password, 10),
        passwordChangedAT: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return next(new ApiError("user not found", 404));
    }
    res.status(200).json({
      success: true,
      MSG: "user Updated",
      data: user,
      token: generateJWT(user),
    });
  }),

  //  @desc updatelogged user data without (password ,role)
  //  @route      PUT /api/users/updateMe
  //  @access      Private (protect)
  updateLoggedUserData: expressAsyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    const user = await User.findByIdAndUpdate(
      { _id },
      {
        name: req.body.name,
        email: req.body.email,
        slug: req.body.slug,
        profileImg: req.body.profileImg,
        phone: req.body.phone,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return next(new ApiError("user not found", 404));
    }
    res.status(200).json({ success: true, MSG: "user Updated", data: user });
  }),

  //  @desc deactivate logged user
  //  @route      DELETE /api/users/deleteMe
  //  @access      Private (protect)
  deleteLoggedUser: expressAsyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return next(new ApiError("user not found", 401));
    }
    user.isActive = false;
    user.save();
    res.status(200).json({
      success: true,
      msg: "Account has been un active!",
      token: "",
    });
  }),
};
