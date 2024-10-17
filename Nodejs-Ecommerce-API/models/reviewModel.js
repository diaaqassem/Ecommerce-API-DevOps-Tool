/* eslint-disable no-undef */
const mongoose = require("mongoose");
const Product = require("./productModel");
//  @desc third schema

const reviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [2, "Too Short Review Name"],
      maxlength: [30, "Maximum Length Exceeded"],
      trim: true,
    },
    ratings: {
      type: Number,
      min: [1, "Minimum Rating is 1.0"],
      max: [5, "Cannot be more than 5"],
      required: [true, "rating is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    //  parent refernce (one to many)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product id is required"],
    },
  },
  {
    timestamps: true, //Saves createdAt and updatedAt as dates (default=false)
  }
);

const relationReview = function (next) {
  this.populate({ path: "user", select: "name" });
  next();
};
reviewSchema.pre(/^find/, relationReview);

// reviewSchema.post("save", relationReview);

reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
  const obj = await this.aggregate([
    // 1)satge one  match to get the desired productId
    { $match: { product: productId } },
    // 2)stage two  group by productid and calculating avgRating and sum up the quantity
    {
      $group: {
        _id: "$product",
        totalAvgRating: { $avg: "$ratings" },
        totalUsers: { $sum: 1 },
      },
    },
  ]);
  if (!obj.length) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: obj[0].totalAvgRating,
      ratingsQuantity: obj[0].totalUsers,
    });
  }
  console.log(obj);
};

reviewSchema.post("save", async function () {
  this.constructor.calcAvgRatingsAndQuantity(this.product);
});
reviewSchema.post("remove", async function () {
  this.constructor.calcAvgRatingsAndQuantity(this.product);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
