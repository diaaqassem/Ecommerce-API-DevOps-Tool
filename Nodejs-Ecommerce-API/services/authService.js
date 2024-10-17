const crypto = require("crypto");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const { sendEmail } = require("../utils/sendEmail");
const { generateJWT } = require("../utils/createToken");
const { sanatizeUser } = require("../utils/sanatizeData");
// const { sendRestPasswordEmail } = require("../utils/sendMailgun");

module.exports = {
  //  @desc        Create  new User
  //  @route       POST /api/auth/signup
  //  @access      Public
  signup: expressAsyncHandler(async (req, res) => {
    const user = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: sanatizeUser(user),
      token: generateJWT(user),
    });
  }),

  //  @desc        login ser
  //  @route       POST /api/auth/login
  //  @access      Public
  login: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //   Validate input
    if (!email || !password) {
      throw new ApiError("Please provide email and password", 400);
    }
    //   Check for user
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }
    // Check for password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new ApiError("Invalid credentials", 401);
    }

    res.status(200).json({ success: true, user, token: generateJWT(user) });
  }),

  //    @desc   make sure user is logged in
  //    middleware
  protect: expressAsyncHandler(async (req, res, next) => {
    // 1) check if token exists , and get it
    // 1.1) if no token , throw error
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new ApiError(
        "Not authorized to access this route ,please login if you have account",
        401
      );
    }
    // 2) verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      next(ApiError("Not authorized to access this route", 401));
    }
    // 3) check if user exists
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      throw new ApiError("No user found", 401);
    }
    // 4) check if user change his password after token created
    if (req.user.passwordChangedAfter(decoded.iat)) {
      // password changed
      throw new ApiError(
        "User recently changed password! Please login again.",
        401
      );
    }

    //  5) active user
    req.user.isActive = true;
    await req.user.save();
    // 6) send the request to the next middleware function in the pipeline
    next();
  }),

  //    @desc   grant access to specific roles(Authorithation (user permissions))
  //    middleware
  restrictTo:
    (...roles) =>
    (req, res, next) => {
      if (req.user.role)
        if (!roles.includes(req.user.role)) {
          throw new ApiError(
            "You do not have permission to perform this action",
            403
          );
        }
      next();
    },

  //  @desc   forget password
  //  @route       POST /api/auth/forgetPassword
  //  @access      Public
  forgetPassword: expressAsyncHandler(async (req, res, next) => {
    // 1) get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new ApiError("There is no user with email address.", 404);
    }
    // 2) if user exist , generate random 6 digit , and save it in DB
    const resetCode = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, 6);

    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    //  console.log(`${resetCode} : ${hashedResetCode}`);
    user.resetCode = hashedResetCode;
    //  add expiration time for password reset code (10m)
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    user.resetVerified = false;
    // Save user with the generated reset code now
    await user.save();

    //  // 3) Send it to user's email
    try {
      await sendEmail(user, resetCode);
    } catch (err) {
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      user.resetVerified = undefined;
      await user.save();
      return next(new ApiError("Cannot send Reset Password Email", 500));
    }
    res.status(200).json({
      status: "success",
      message: `A password reset link has been sent to your email.`,
      warn: "if you dont found message check spam messages",
    });
  }),

  //  @desc   verify password reset code
  //  @route       POST /api/auth/verifyPasswordReset
  //  @access      Public
  verifyPasswordReset: expressAsyncHandler(async (req, res, next) => {
    // 1) get user baseed on rest code
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");
    const user = await User.findOne({
      resetCode: hashedResetCode,
      resetCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new ApiError("Invalid reset code", 404);
    }
    // 2) reset code valid
    user.resetVerified = true;
    // Save user with the generated reset code now
    await user.save();
    res.status(200).json({
      status: "success",
      message: `Password reset code has been verified`,
    });
  }),

  //  @desc   reset password
  //  @route       POST /api/auth/resetPassword
  //  @access      Public
  resetPassword: expressAsyncHandler(async (req, res, next) => {
    const { password, confirmPassword, email } = req.body;

    // Check token and expiration
    const user = await User.findOne({
      email,
      resetVerified: true,
      resetCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ApiError(`invalid token!!`, 400));
    }

    // Validate passwords
    if (password !== confirmPassword) {
      return next(new ApiError("Passwords do not match", 400));
    }

    // Hash Password and update user password
    if (password === confirmPassword) {
      user.password = password;
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      user.resetVerified = undefined;
      await user.save();
    } else {
      return next(
        new ApiError("Error in saving new password to database", 500)
      );
    }

    // Return JWT
    res.status(200).json({
      status: "success",
      message: `Password has been reset`,
      token: generateJWT(user),
    });
  }),
};
