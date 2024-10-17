/* eslint-disable import/extensions */
// eslint-disable-next-line import/newline-after-import
const express = require("express");
const router = express.Router();
const {
  newUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
  uploadUserImage,
  resizeUserImage,
  changeUserPassword,
  getLoggedUser,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require("../services/userService.js");
const {
  getUserIDValidator,
  createUserValidator,
  updateUserValidator,
  delUserValidator,
  changePasswordValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/userValidator.js");
const { protect, restrictTo } = require("../services/authService.js");

//  user
router.use(protect);

router.get("/getMe", getLoggedUser, getUserById);
router.put(
  "/changeMyPassword",
  getLoggedUser,
  changePasswordValidator,
  changeLoggedUserPassword
);
router.put(
  "/updateMe",
  uploadUserImage,
  resizeUserImage,
  getLoggedUser,
  updateUserValidator,
  updateLoggedUserData
);
router.delete("/deleteMe", deleteLoggedUser);

// Admin
router.use(protect, restrictTo("admin"));

router
  .route("/changePassword/:id")
  .put(changePasswordValidator, changeUserPassword);

router
  .route("/")
  .get(getUsers)
  .post(
    restrictTo("manager"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    newUser
  );
router
  .route("/:id")
  .get(getUserIDValidator, getUserById)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(delUserValidator, deleteUser);

module.exports = router;
