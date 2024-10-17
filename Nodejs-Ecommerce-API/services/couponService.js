const {Coupon} = require("../models/couponModel");
const {
  updateOne,
  deleteOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

module.exports = {
  //  @desc        Create  new Coupon
  //  @route       POST /api/coupons/
  //  @access      Private (for admin,manager)
  newCoupon: createOne(Coupon),

  //  @desc         Get all Categories
  //  @route        GET /api/coupons/
  //  @access      Private (for admin,manager)
  getCoupons: getAll(Coupon, "coupons"),

  //  @ desc     Get specific Coupon by id
  //  @route      GET /api/coupons/:id
  //  @access      Private (for admin,manager)
  getCouponById: getOne(Coupon),

  //  @ desc     Update specific Coupon by id
  //  @route      PUT /api/coupons/:id
  //  @access     private (for  admin ,manager)
  updateCoupon: updateOne(Coupon),

  //  @ desc     remove Coupon by id
  //  @route      DELETE /api/coupons/:id
  //  @access     private (for  admin only)
  deleteCoupon: deleteOne(Coupon),
};
