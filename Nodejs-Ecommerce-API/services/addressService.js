const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

module.exports = {
  //  @desc        add address to user
  //  @route       POST /api/addresses/
  //  @access      Private (for user)
  addToAddresses: expressAsyncHandler(async (req, res) => {
    const { city, postalCode, phone, details, alias } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          addresses: [
            {
              city,
              alias,
              postalCode,
              phone,
              details,
            },
          ],
        },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      Message: "address added successfully ",
      data: user.addresses,
    });
  }),

  //   @desc         get addresses from logged user
  //   @route        GET /api/addresses/
  //   @access       Private (For Auth users)
  getUserAddresses: expressAsyncHandler(async (req, res) => {
    if (!req.user.addresses) {
      throw new ApiError("No addresses Found!", 404);
    }
    res.status(200).json({
      success: true,
      count: req.user.addresses.length,
      data: req.user.addresses,
    });
  }),

  //   @desc         Remove from Wish List
  //   @route        DELETE /api/addresses/:id
  //   @access       Private (For user)
  removeFromAddresses: expressAsyncHandler(async (req, res) => {
    if (!req.user.addresses.includes(req.params.id)) {
      throw new ApiError("address not found ", 404);
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { addresses: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "address has been removed from your addresses",
    });
  }),
};
