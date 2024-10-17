const Review = require("../models/reviewModel");
const {
  updateOne,
  deleteOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

module.exports = {
  setProductIdToBody: (req, res, next) => {
    //  @desc apply nested route middleware to add product id to req.body

    //  @desc apply nested route
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
  },

  createFilterObj: (req, re, next) => {
    //  @desc apply nested route (get route)
    const { productId } = req.params;
    let filterObj = {};
    if (productId) {
      filterObj = { product: productId };
      req.filterObj = filterObj;
      next();
    } else next();
  },

  //  @desc        Create  new Review
  //  @route       POST /api/reviews/
  //  @access      Private/protect/user
  newReview: createOne(Review),

  //  @desc         Get all Categories
  //  @route        GET /api/reviews/
  //  @access       Public
  getReviews: getAll(Review, "Reviews"),

  //  @ desc     Get specific Review by id
  //  @route      GET /api/reviews/:id
  //  @access     Public
  getReviewById: getOne(Review),

  //  @ desc     Update specific Review by id
  //  @route      PUT /api/reviews/:id
  //  @access     private/protect/user
  updateReview: updateOne(Review),

  //  @ desc     remove Review by id
  //  @route      DELETE /api/reviews/:id
  //  @access     private/protect/user,admin,manager
  deleteReview: deleteOne(Review),
};
