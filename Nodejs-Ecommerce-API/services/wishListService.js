const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

module.exports = {
  //  @desc        add product to wish list
  //  @route       POST /api/wishList/
  //  @access      Private (for user)
  addToWishlist: expressAsyncHandler(async (req, res) => {
    if (!req.body.productId) {
      throw new ApiError("Please provide a valid Product ID", 400);
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { wishList: req.body.productId },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      Message: "product added successfully to your wish list",
      data: user.wishList,
    });
  }),

  //   @desc         get Wish List of logged user
  //   @route        GET /api/wishList/
  //   @access       Private (For Auth users)
  getUserWishList: expressAsyncHandler(async (req, res) => {
    if (!req.user.wishList) {
      throw new ApiError("No Data Found!", 404);
    } else {
      const user = await req.user.populate({
        path: "wishList",
        select: "title price imageCover  -subCategories ",
      });
      res.status(200).json({
        success: true,
        count: user.wishList.length,
        data: user.wishList,
      });
    }
  }),

  //   @desc         Remove from Wish List
  //   @route        DELETE /api/wishList/:id
  //   @access       Private (For user)
  removeFromWishlist: expressAsyncHandler(async (req, res) => {
    if (!req.user.wishList.includes(req.params.id)) {
      throw new ApiError("Product not found in the wishlist", 404);
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishList: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Product has been removed from your wishlist",
    });
  }),
};
